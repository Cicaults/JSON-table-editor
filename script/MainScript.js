var main = function () {
	// Строим html для кнопок, добавления и удаления строк таблицы
	// Кнопка добавления
	var buttonsInPopover = 
	$('<button>').append(
		$('<span>').addClass('glyphicon glyphicon-plus'))
	.attr({
		type: 'button',
		class: 'btn btn-success',
		id: 'addButton'
	});

	// Кнопка удаления
	var buttonDelete =
	$('<button>').append(
		$('<span>').addClass('glyphicon glyphicon-minus'))
	.attr({
		type: 'button',
		class: 'btn btn-danger',
		id: 'removeButton'
	});
		
	// Объединяем кнопки
	$.merge(buttonsInPopover,buttonDelete);

	// Настройки для popover
	var settings = {
		html: true,
		trigger: "manual",
		content: buttonsInPopover,
		animation: false,
		container: "body"
	};

	// Функция привязывает popover к строкам таблицы, плюс подсветка 
	function updatePopover(){
		$(".table tr").popover(settings).on("mouseenter", function () {
			var _this = this;
			$(this).popover("show");
			$(this).addClass("activated");
			$(".popover").on("mouseleave", function () {
				$(_this).popover("hide");
				$(_this).removeClass("activated");
			});
		}).on("mouseleave", function () {
			var _this = this;	
			if (!$(".popover:hover").length) {
				$(_this).popover("hide");
				$(_this).removeClass("activated");
			}
	});
	}
	updatePopover();

	// Перетаскивание строк таблицы
    $('.table tbody').sortable({
    	start: function(event, ui){ $('.activated').popover("hide"); },
    	stop: renumberTable
    });

    // Вспомогательная функция для сортировки номеров строк
    function renumberTable() {
    	$(".table tbody tr").each(function() {
    		count = $(this).parent().children().index($(this)) + 1;
    		$(this).find('th').html(count);
    	});
    }

    // Строка таблицы
    var newTableRow = $('<tr>').append($('<th>'),$('<td>'),$('<td>'));
    // Добавить строку
	$('body').on("click","#addButton", function(){
		// Если выделен заголовок таблицы, добавляем строку в начало
		if($('.table thead tr').hasClass('activated')){
			$('.table tbody').prepend($(newTableRow).clone());
			renumberTable();
			updatePopover();
		}
		// Иначе после текущей строки
		else {
			$('.table tbody tr.activated').after($(newTableRow).clone());
			renumberTable();
			updatePopover();
		}
	});

	// Удаление строки
	$('body').on("click","#removeButton", function(){
		$(".table tbody tr").popover("hide").remove("tr.activated");
		renumberTable();
	});

	// Делаем тело таблицы редактируемым 
	$('.table tbody').editable({
		type: 'text',
		mode: 'inline',
		selector: 'td',
		emptytext: '',
		toggle: 'dblclick'
		});

	// Переводим данные таблицы в JSON формат
	$('#serializeTable').click(function() {
		var serialized = $('.table').tableToJSON({
			ignoreColumns: [0]
		});
		$('#jsonTA').val(JSON.stringify(serialized));
		$('.alert').hide();
	});

	// Строим таблицу по данным из Textarea
	$('#updateTable').click(function() {
		try{
			// Значения null заменяем на пустую строку
			var tableData = JSON.parse($('#jsonTA').val(), function(key, value){
				if(value == null)
					return "";
				else
					return value;
			});

			$('.table tbody').empty();
			for (var i = 0; i < tableData.length; i++) {
			$('.table tbody').append($('<tr>').append(
				$('<th>').html(i+1), $('<td>').html(tableData[i].name), $('<td>').html(tableData[i].value)));
		}
		updatePopover();
		$('.alert').hide();
	}
	catch(e){
		$('.alert').show();
	}
});

	$('button.close').click(function() {
		$('.alert').hide();
	});

	// Загрузка исходной таблицы из файла
	$('#loadJson').click(function() {
		$.getJSON('defaultTable.json', function(json, textStatus) { 
			$('#jsonTA').val(JSON.stringify(json));
			$('#updateTable').trigger('click');
		}).fail(function(){
			$('#jsonTA').val("Не удалось загрузить данные из файла!");
		}
		);
	});

	// Загрузка из файла пользователя (только валидный JSON)
	$('#loadFile').change(function() {
		var fileName = $(this).val().split('\\').pop();
		$.get(fileName, function(data) {
			$('#jsonTA').val(JSON.stringify(data));
			$('#fileSpan').html(fileName);
		},
		"json")
		.fail(function () {
			$('#jsonTA').val("Не удалось загрузить данные из файла!");
			$('#loadFile').val(null);
			$('#fileSpan').html(null);
		});
	});

	// Сохранение в файл
	$('#saveJson').click(function() {
		try{
			var dataFromTA = JSON.parse($('#jsonTA').val());
			var fileName = $('input.form-control').val();
			
			if (fileName.length == 0) {
				fileName = "Json Data From TextArea";
			}
			var newFile = new Blob([JSON.stringify(dataFromTA)], {type: "application/json;charset=utf-8"});
			saveAs(newFile, fileName + ".json"); 
		}
		catch(e){
			$('.alert').show();
		}
	});

	// Загружаем исходную таблицу
	$('#loadJson').trigger('click');

}

$(document).ready(main);