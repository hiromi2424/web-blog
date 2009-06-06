<script type="text/javascript">

function showLogin() {
    $('#login_id').removeClass("invisible").addClass("visible");
}

function hideLogin() {
    $('#login_id').removeClass("visible").addClass("invisible"); 
}

var articles_json = null;
var TAGS_IDX = 3;

function genTagCloudHtml() {
  var all_tags = {};
  var all_tags_arr = [];
  var tag, tags;
  var tag_count;
  var i, j;
  var txt = "";
  var lines = [];

  for (i=0; i < articles_json.length; i++) {
    tags = articles_json[i][TAGS_IDX];
    for (j=0; j < tags.length; j++) {
      tag = tags[j];
      tag_count = all_tags[tag];
      if (undefined == tag_count) {
        tag_count = 1;
      } else {
        tag_count = tag_count + 1;
      }
      all_tags[tag] = tag_count;
    }
  }

  for (tag in all_tags) {
    all_tags_arr.push(tag);
  }

  all_tags_arr.sort();
  lines.push('<a href="/archives.html">all' + '</a> <span class="light">(' + articles_json.length + ')</span> ');
  for (i = 0; i < all_tags_arr.length; i++) {
    tag = all_tags_arr[i];
    tag_count = all_tags[tag];
    txt = '<a href="/tag/' + encodeURIComponent(tag) + '">' + tag + '</a> <span class="light">(' + tag_count + ')</span> ';
    lines.push(txt);
  }
  txt = lines.join("");
  return txt;
}
</script>