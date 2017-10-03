# JSON TAble Editor
Редактор простых табличных данных в формате JSON.

## Возможности

+ Добавление\удаление строк. При наведении на строку таблицы появляются кнопки "плюс" и "минус". Добавляется пустая строка после выделенной. Удалить заголовок нельзя.
+ Редактирование ячеек таблицы. Двойной клик по ячейке. Редактировать заголовок и номера строк нельзя.
+ Сортировка путем перетаскивания строк таблицы.
+ Загрузка\выгрузка данных в формате JSON. Процесс проходит через текстовое поле на странице. Возможна загрузка из файла. Если при загрузке\сохранении предоставлен невалидный JSON будет выдана ошибка.

## Использованные технологии

1. jQuery и jQueryUI
2. Bootstrap
3. X-Editable (http://vitalets.github.io/x-editable/)
4. Table-to-JSON (http://lightswitch05.github.io/table-to-json/)
5. FileSaver.js + Blob.js (https://github.com/eligrey/FileSaver.js)

Хотя страница и имеет адекватный вид на мобильных устройствах (спасибо, Bootstrap!), но на тач-девайсах не работает сортировка перетаскиванием.
