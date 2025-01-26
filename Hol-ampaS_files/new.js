var currentTypeAheadField = null;

$('#DevwI').on('show.bs.modal',
function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var tlhid = button.data('tlhid'); // Extract info from data-* attributes
    var tlhmlink = button.data('tlhmlink'); // Extract other info
    $('#editWord').show();
    $('#saveWord').hide();

    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-body').html('<center><img src="https://hol.kag.org/images/anim.gif" height="100px"></center>');

    var bits = tlhid.split("-");

    var sharelink = getPathFromUrl(window.location.href) + "?o=DevwI" + bits[0];
    var fbURL = 'https://www.facebook.com/sharer/sharer.php?u=' + sharelink;
    var twURL = 'https://twitter.com/share?url=' + sharelink;

    modal.find('.modal-title').text('tlhIngan HolQeD qawHaq - Klingon Linguistic Database');
    // modal.find('.modal-body').text('Some Content is here!');
    modal.find('.modal-body').load('/main.php?DEWI=1&id=' + tlhid);
    //modal.find('.modal-submit').text('Edit');
    modal.find('.modal-save').attr('data-tlhid', tlhid);
    modal.find('.modal-save').data('tlhid', tlhid);
    modal.find('.modal-edit').attr('data-tlhid', tlhid);
    modal.find('.modal-edit').data('tlhid', tlhid);

    modal.find('.fbshare').attr('href', fbURL);
    modal.find('.twshare').attr('href', twURL);
    modal.find('.twshare').attr('data-url', sharelink);
    modal.find('.twshare').data('url', sharelink);

    modal.find('.lnshare').attr('data-clipboard-text', sharelink);
    modal.find('.lnshare').data('clipboard-text', sharelink);
});

$('#editWord').click(function(e) {
    var button = $(this);
    var tlhid = button.data('tlhid');
    var lang = "";

    var data = tlhid.split("-");
    var id = data[0];
    if (data.length == 2) {
        lang = data[1];
    } else {
        lang = "en";
    }

    $('#editWord').hide();
    $('#saveWord').show();

    var modal = $('#DevwI');

    modal.find('.modal-body').html('<center><img src="https://hol.kag.org/images/anim.gif" height="100px"></center>');
    modal.find('.modal-body').load('/main.php?DEWI=4&id=' + id + '&lang=' + lang,
    function() {
        if ($('#info').length) {
            $('#info').summernote({
                //height: 500,
                toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline', 'clear']], ['fontname', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['height', ['height']], ['table', ['table']], ['insert', ['link', 'picture', 'hr']], ['view', ['fullscreen', 'codeview']], ['help', ['help']]],
            });
        }
        if ($('#notes').length) {
            $('#notes').summernote({
                //height: 500,
                toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline', 'clear']], ['fontname', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['height', ['height']], ['table', ['table']], ['insert', ['link', 'picture', 'hr']], ['view', ['fullscreen', 'codeview']], ['help', ['help']]],
            });
        }
    });
});

$('#saveWord').click(function(e) {
    var button = $(this);

    $('#editWord').hide();
    $('#saveWord').show();

    var modal = $('#DevwI');
    var queryString = $('#choHmoH').formSerialize();

    modal.find('.modal-body').html('<center><img src="https://hol.kag.org/images/anim.gif" height="100px"></center>');
    modal.find('.modal-body').load('/main.php?' + queryString);

    $('#editWord').show();
    $('#saveWord').hide();

    //alert("You clicked me! Query = " + queryString);
});

function newDevwILookup(word) {
    var modal = $('#DevwI');

    modal.find('.modal-body').html('<center><img src="https://hol.kag.org/images/anim.gif" height="100px"></center>');

    modal.find('.modal-body').load('/main.php?DEWI=6&id=' + encodeURIComponent(word));
}

function newDevwILookupID(tlhid) {
    var modal = $('#DevwI');

    modal.find('.modal-body').html('<center><img src="https://hol.kag.org/images/anim.gif" height="100px"></center>');

    modal.find('.modal-body').load('/main.php?DEWI=1&id=' + encodeURIComponent(tlhid));
}

function set_theme(theme) {
    $('link[title="main"]').attr('href', theme);

    var supports_storage = supports_html5_storage();
    if (supports_storage) {
        localStorage.theme = theme;
        jQuery.ajax('https://hol.kag.org/main.php?theme=' + theme);
    }
}

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
        return false;
    }
}

function getUrlVars() {
    var vars = [],
    hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
}

function setTooltip(btn, message) {
    $(btn).tooltip('hide').attr('data-original-title', message).tooltip('show');

    setTimeout(function() {
        $(btn).tooltip('hide').attr('data-original-title', '').tooltip('hide');
    },
    1000);
}

$(document).ready(function() {
    //   localStorage.clear();
    var words = new Bloodhound({
        local: wordList,
        identify: function(obj) {
            return obj.id;
        },
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        sorter: function(a, b) {
            var input_string = currentTypeAheadField.val();
            input_string = input_string.split(/[ \-]+/);
            input_string = input_string[0].toLowerCase();
            var aArray = a.name.toLowerCase().split(/[ \-]+/);
            var bArray = b.name.toLowerCase().split(/[ \-]+/);
            var apos = 0,
            bpos = 0;
            for (var i = 0; i < aArray.length; i++) {
                if (aArray[i].indexOf(input_string) !== -1) {
                    apos = i;
                    break;
                }
            }
            for (i = 0; i < bArray.length; i++) {
                if (bArray[i].indexOf(input_string) !== -1) {
                    bpos = i;
                    break;
                }
            }
            if (apos < bpos) {
                return - 1;
            } else if (apos > bpos) {
                return 1;
            } else return 0;
        },
        remote: {
            url: "https://hol.kag.org/index.php?words=%QUERY&JSON_ONLY=1",
            wildcard: "%QUERY",
        }
    });

    $('#wordInput').on('focus', function() {
        currentTypeAheadField = $(this);
    })
    
    $('#wordInput-xs').on('focus', function() {
        currentTypeAheadField = $(this);
    })

    $('#wordInput').typeahead({
        hint: false,
        highlight: true,
        minLength: 1
    },
    {
        name: 'words',
        display: 'name',
        limit: '20',
        source: words,
    }).on('typeahead:selected',
    function(event, data) {
        $('.typeahead').val(data.word);

        currentTypeAheadField = $(this);
        var $typeahead = $(this),
        $form = $typeahead.parents('form').first();

        $form.submit();
    });

    $('#wordInput-xs').typeahead({
        hint: true,
        highlight: true,
        minLength: 2
    },
    {
        name: 'words',
        display: 'name',
        limit: '20',
        source: words,
    }).on('typeahead:selected',
    function(event, data) {
        $('.typeahead').val(data.word);

        currentTypeAheadField = $(this);
        var $typeahead = $(this),
        $form = $typeahead.parents('form').first();

        $form.submit();
    });

    autosize($('#styled'));

    autosize($('#words'));

    autosize($('#tlh'));

    autosize($('#eng'));

    $(".dropdown").on("shown.bs.dropdown",
    function() {
        $(this).find(".dropdown-menu li.active a").focus()
    });

    if ($('#editContent').length) {
        $('#editContent').summernote({
            height: ($(window).height() - 250),
            toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline', 'clear']], ['fontname', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['height', ['height']], ['table', ['table']], ['insert', ['link', 'picture', 'hr']], ['view', ['fullscreen', 'codeview']], ['help', ['help']]],
        });
    }

    var onResize = function() {
        // apply dynamic padding at the top of the body according to the fixed navbar height
        $("body").css("padding-top", $(".navbar-fixed-top").height());
    };

    // attach the function to the window resize event
    $(window).resize(onResize);

    // call it also when the page is ready after load or reload
    $(function() {
        //  onResize();
    });

    $(window).load(function() {
        onResize();

        $('.foreground').colorpicker({
            format: 'hex'
        });
        $('.background').colorpicker({
            format: 'hex'
        });

        var get = getUrlVars();
        if (get["o"] != undefined) {
            $("#" + get["o"]).click();
        }
    });

    $('lnshare').tooltip({
        trigger: 'click',
        placement: 'bottom'
    });

    var clipboard = new Clipboard('.lnshare', {
        container: document.getElementById('DevwI')
    });

    clipboard.on('success',
    function(e) {
        setTooltip(e.trigger, 'Copied!');
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });

    clipboard.on('error',
    function(e) {
        setTooltip(e.trigger, 'Failed!');
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    $('body').on('click', '.change-style-menu-item',
    function() {
        var theme_name = $(this).attr('rel');
        if (theme_name == "readable-black") {
            var theme = "//hol.kag.org/bs/css/readable-black.min.css";
        } else {
            var theme = "//netdna.bootstrapcdn.com/bootswatch/3.3.5/" + theme_name + "/bootstrap.min.css";
        }
        set_theme(theme);
    });

    var supports_storage = supports_html5_storage();

    if (supports_storage) {
        var theme = localStorage.theme;
    } else {
        /* Don't annoy user with options that don't persist */
        $('#theme-dropdown').hide();
    }

    $(function() {
        $('[data-toggle="popover"]').popover()
    })

    if ($('#game').length) {
        $.getScript("/bs/js/games/matching/tile.js");
        $.getScript("/bs/js/games/matching/jquery.flip.js");
        $.getScript("/bs/js/games/matching/matching.js");

    }
});