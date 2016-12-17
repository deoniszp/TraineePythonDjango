$(document).ready(function () {
    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", $('input[name="csrfmiddlewaretoken"]').val());
            }
        }
    });

    function drawChart(text) {
        var data = {};
        var txt = text.replace(/[^a-z]/g, "");

        for (var i = 0; i < txt.length; i++) {
            if (data[txt[i]] === undefined) {
                data[txt[i]] = 0;
            }
            data[txt[i]] += 1;
        }

        if (txt.length > 0){
            ChartData(data);
        }else{ChartData({'0':0});}

    }

    // Отрисовываем частотный график с помощью библиотеки jplot
    function ChartData(data){
        // Инициализируем списки для осей x и y
        var dataSlices = [];
        var ticks = [];

        // Преобразуем словарь в два списка
        for (key in data){
            dataSlices.push(data[key]);
            ticks.push(key);
        }

        $.jqplot.config.enablePlugins = true;

        plot1 = $.jqplot('chart', [dataSlices], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: {
                text: 'Частотная характеристика букв',
                textColor: 'coral',
                fontSize: '16pt',
            },

            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks,
                }
            },
            highlighter: { show: false }
        });

        plot1.replot();
    };

    function getdata(text, shift, type) {
        if (shift && text && type) {

            $('#shiftshow').addClass('hidden');

            drawChart(text);

            $.ajax({
                type: "POST",
                url:  "/crypt",
                data: JSON.stringify({msg : text, type : type, shift : shift}),
                contentType: 'application/json',
                cache: false,
                success: function(data){
                    $('textarea[name="txtOut"]').val(data.result);
                },
                error: function (xhr) {
                    console.log(xhr);
                }});
        }
    }

    function getshift(text) {
        $.ajax({
            type: "POST",
            url:  "/crypt",
            data: JSON.stringify({msg : text, type : 'getshift'}),
            contentType: 'application/json',
            cache: false,
            success: function(data){
                $('input[name="setshift"]').val(data.result);
                $('#shiftshow').removeClass('hidden');
            },
            error: function (xhr) {
                console.log(xhr);
            }});

    }

    $('button[name="encrypt"]').click(function (){
        var txtIn =  $('textarea[name="txtIn"]').val().toLowerCase();
        var shift =  $('input[name="shift"]').val();

        getdata(txtIn, shift, 'encrypt');
    });

    $('button[name="decrypt"]').click(function (){
        var txtIn =  $('textarea[name="txtIn"]').val().toLowerCase();
        var shift =  $('input[name="shift"]').val();

        getdata(txtIn, shift, 'decrypt');
    });

    $('button[name="getshift"]').click(function (){
        var txtIn =  $('textarea[name="txtIn"]').val().toLowerCase();
        getshift(txtIn);
    });

});