// ページ読み込み後に呼ぶ処理
$(function() {
  getNotice();
  placeholder();
  pageTop();

  var searchParams = (new URLSearchParams(document.location.search));
  var query = searchParams.get('query');
  if(query.length>0) {
    $('#freeWord').val(query);
    onSearch();
  }
});

// 検索を行い、結果表示を行う関数
// 引数　：なし
// 戻り値：なし（DOMの変更）
// 備考　：「検索する」ボタン押下時に呼び出される
function onSearch() {
  // 検索開始
  loadingStart();
  $('#searchButton').prop('disabled', true);
  var freeWord = $('#freeWord').val();
  var csvPath = './data/rdr-help.csv';
  var count = 0;
  var target = '#resultTable';

  // 結果テーブルを初期化
  $(target).empty();

  var getData = function(count){
    $.get(csvPath).done(function(data) {
      var csv = $.csv.toArrays(data, {separator: ',', delimiter: '\n'});
      $(csv).each(function(_index, element) {
        var searchedWord = element[2].split('<br>').join('').split(' ').join('').split('　').join('');
        // 空レコードか否かの確認
        if (element.length > 0) {
          // 表示レコード数が300件を超えたか否かの確認
          if (count <= 300) {
            if(checkFreeWord(freeWord, searchedWord)){
              var insert = '';
              insert = '<tr><td class="break-word"><a href="https://produ.irelang.jp/docs/'+element[0]+'">' + element[1] + '</a></td><td class="small break-word">' + element[2] + '</td></tr>';
              $(target).append(insert);
              count += 1;
            }
          } else {
            loadingEnd(count);
            return false;
          }
        }
      });
      loadingEnd(count);
    }).fail(function() {
      // 検索終了
      loadingError();
      return false;
    });
  };
  getData(count);
  // get_dataをメモリから解放（意味があるかはわからない）
  delete getData;
}

// 検索状態に表示を変更するための関数
// 引数　：なし
// 戻り値：なし（DOMの変更）
// 備考　：onSearch()から呼ばれる
function loadingStart(){
  $('#loadingEnd').css('display', 'none');
  $('#loadingStart').css('display', 'block');
  $('#result').css('display', 'block');
}

// 検索完了状態に表示を変更するための関数
// 引数　：なし
// 戻り値：なし（DOMの変更）
// 備考　：onSearch()から呼ばれる
function loadingEnd(recordCount){
  $('#loadingStart').css('display', 'none');
  $('#loadingEnd').css('display', 'block');

  if(recordCount == 301) {
    $('#loadingEnd').html('検索結果が300件を超えました。300件目以降は表示されません。');
  } else {
    $('#loadingEnd').html('検索結果は' + recordCount + '件です。');
  }

  $('#searchButton').prop('disabled', false);
}

// サーバエラー状態に表示を変更するための関数
// 引数　：なし
// 戻り値：なし（DOMの変更）
// 備考　：onSearch()から呼ばれる
function loadingError(){
  $('#loadingStart').css('display', 'none');
  $('#loadingEnd').css('display', 'block');
  $('#loadingEnd').html('エラーが発生しました。再度、検索して下さい。');
  $('#searchButton').prop('disabled', false);
}

// 日付表示を編集するための関数
// 引数　：YYYYMMDD（String）
// 戻り値：YYYY/MM/DD（String）
function dateFormat(str) {
  var result;
  if(str.length == 8) {
      result = str.substr(0,4) +"/"+ str.substr(4,2) + "/" +str.substr(6,2);
  } else {
    result = str;
  }
  return result;
}

// 取得したドキュメントが検索条件にマッチするかを判定するための関数
// 引数　：フリーワード（String）, 起案文書（String）
// 戻り値：真偽値（Boolean）
// 備考　：onSearch()から呼ばれる
function checkFreeWord(freeWord, doc) {
  var result = false;
  if(freeWord == '検索したいフリーワードを入力してください') {
    result = true;
  } else if(/[,\s]/.test(freeWord)){
    var freeWordArray = freeWord.split(/[,\s]/);
    var tempBool = true;
    for(var j = 0; j < freeWordArray.length; j++){
      // 全角・半角スペースの削除
      var searchedWord = freeWordArray[j].split(' ').join('').split('　').join('');
      if(doc.toUpperCase().indexOf(searchedWord.toUpperCase()) == -1){
        tempBool = false;
      }
    }
    if(tempBool){
      result = true;
    }
  } else if(doc.toUpperCase().indexOf(freeWord.split(' ').join('').split('　').join('').toUpperCase()) != -1){
    result = true;
  }
  return result;
}

// お知らせ欄にコンテンツを表示するための関数
// 引数　：なし
// 戻り値：なし（DOMの追加）
// 備考　：画面ロード時に呼ばれる
function getNotice() {
  var path = './data/notice.csv';
  var count = 0;
  var getBool = true;
  var target = '#notice';
  var get_data = function(count){
    $.get(path).done(function(data) {
      var csv = $.csv.toArrays(data, {delimiter: '\n'});
      $(csv).each(function(_index, element) {
        // 空レコードか否かの確認
        if (element.length > 0) {
          // 表示レコード数が30件を超えたか否かの確認
          if (count <= 30) {
            var insert = '';
            insert = '<li class="list-group-item py-2 px-3">' + element + '</li>';
            $(target).append(insert);
            count += 1;
          } else {
            getBool = false;
            return false;
          }
        }
      });
    }).fail(function() {
        return false;
    });
  };
  get_data(count);
}

// ページトップに戻るための関数
// 引数　：なし
// 戻り値：なし
// 備考　：100pxスクロールしたらボタンを表示する
function pageTop() {
  var appear = false;
  var pageTop = $('#pageTop');
  $(window).scroll(function () {
    // 100pxスクロールしたら
    if ($(this).scrollTop() > 100) {
      if (appear == false) {
        appear = true;
        //0.3秒かけて現れる
        pageTop.stop().animate({
          //下から85pxの位置に
          'bottom': '85px'
        }, 300);
      }
    } else {
      if (appear) {
        appear = false;
        // 0.3秒かけて隠れる
        pageTop.stop().animate({
          // 下から-85pxの位置に
          'bottom': '-85px'
        }, 300);
      }
    }
  });
  pageTop.click(function () {
    //0.5秒かけてトップへ戻る
    $('body, html').animate({ scrollTop: 0 }, 500);
    return false;
  });
}

// ie9で非対応のplaceholderに対応するたの関数
// 引数　：なし
// 戻り値：なし
// 備考　：ページロード時に呼ばれる
function placeholder() {
  var supportsInputAttribute = function (attr) {
    var input = document.createElement('input');
    return attr in input;
  };
  if (!supportsInputAttribute('placeholder')) {
    $('[placeholder]').each(function () {
    var
      input = $(this),
      placeholderText = input.attr('placeholder'),
      // placeholderColor = 'GrayText',
      placeholderColor = '#BBBBBB';
      defaultColor = input.css('color');
    input.
      focus(function () {
      if (input.val() === placeholderText) {
        input.val('').css('color', defaultColor);
      }
      }).
      blur(function () {
      if (input.val() === '') {
        input.val(placeholderText).css('color', placeholderColor);
      } else if (input.val() === placeholderText) {
        input.css('color', placeholderColor);
      }
      }).
      blur().
      parents('form').
      submit(function () {
        if (input.val() === placeholderText) {
        input.val('');
        }
      });
    });
  }
}