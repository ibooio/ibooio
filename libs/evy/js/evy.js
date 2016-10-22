/*******************************************************
********************************************************
********************************************************
                           EVY TOOLKIT
                    Made with <3 by DAIALAB
                      http://www.daialab.com
********************************************************
********************************************************/
(function ($) {
  var table= null;
  function Table(){
    var self = this;
    this.el=null;
    this.loading=true;
    this.options={};
    var actualPage=1;



    this.refresh = function(){
      self.render();
    }
    this.render= function(complete){
      $(self.el).css('position', 'relative');
      var loading= $('<div class="e-table-loading">Caragando...</div>').appendTo(self.el);
      if($(self.el).find('.e-table').length==1){
        var table= $(self.el).find('.e-table').first();
        $(loading).css('background-color', 'rgba(255, 255, 255, 0.8)');
        $(loading).css('margin-left', ($(self.el).width()-$(table).width())/2);
        $(loading).css('width', $(table).width()+2);
        $(loading).css('line-height', ($(table).height()+2) + 'px');
      }
      if(self.options.pagination)
        self.options.pageSize= self.options.pageSize ? self.options.pageSize : 10;
      var url =self.options.url;
      if(self.options.urlExtra)
        url+= window[self.options.urlExtra]();
      $.getJSON(url, function( data ) {
          self.options.rows= data;
          draw();
          $(loading).remove();
      });
    };
    var draw= function(){
      var table, thead, tbody, tfoot, tr, th, td = null;
      $(self.el).find('table').first().remove();
      table= $('<table class="e-table">').appendTo(self.el);
      $(table).css('width', self.options.width ? self.options.width : 'auto');
      if(self.options.minWidth) $(table).css('min-width', self.options.minWidth);
      $(table).css('margin', '0 auto');
      thead= $('<thead>').appendTo(table);
      tr= $('<tr>').appendTo(thead);
      jQuery.each(self.options.columns, function(i, column) {
        header= $('<th>').appendTo(tr);
        header.append(column.title);
      });
      if(self.options.buttons){
        header= $('<th>').appendTo(tr);
        header.append('Opciones');
      }
      tbody= $('<tbody>').appendTo(table);
      var count_rows=0;
      var count_cols=0;
      jQuery.each(self.options.rows, function(i, row) {
        count_rows++;
        if(!self.options.pagination || (i>=(self.options.pageSize*actualPage-self.options.pageSize) &&i<self.options.pageSize*actualPage)){
          tr= $('<tr>').appendTo(tbody);
          jQuery.each(self.options.columns, function(j, column) {
            td= $('<td>').appendTo(tr);
            var parts= column.name.split('.');
            if(parts.length==1){
              $(td).append(row[column.name]);
            }
            else{
              var length= parts.length;
              var obj=row[parts[0]];
              if(obj){
                jQuery.each(parts, function(k, p) {
                  if(k!=0){
                    if(k==length-1){
                      $(td).append(obj[parts[k]]);
                    }
                    else{
                      obj=obj[p];
                    }
                  }
                });
              }
            }
          });
          var buttons= typeof self.options.buttons != 'undefined';
          if(buttons){
            td= $('<td class="row-functions">').appendTo(tr);
            jQuery.each(self.options.buttons, function(k, button) {
              var btn= $('<div class="e-button">').appendTo(td);
              $(btn).click(function () {
                  window[button.action](row, $(this).parent().parent());
              })
              if(button.classes)
                $(btn).addClass(button.classes);
              if(button.text){
                if(button.icon){
                  button.text= ' ' + button.text;
                }
                $(btn).append(button.text);
              }

              if(button.icon)
                $(btn).prepend('<i class="e-icon '+button.icon+'"></i>');
          });
          }
        }
      });
      count_cols= $(tr).children().length;
      if(self.options.pagination && self.options.pageSize-count_rows>0){
        tr= $('<tr style="height:'+ (self.options.pageSize-count_rows)*50 +'px">').appendTo(tbody);
        cell= $('<td colspan="'+count_cols+'">').appendTo(tr);
      }
      if(self.options.pagination){
        var colspan= self.options.buttons ?  self.options.columns.length+1 : self.options.columns.length;
        tfoot= $('<tfoot>').appendTo(table);
        tr = $('<tr>').appendTo(tfoot);
        th = $('<th colspan="'+colspan+'" style="text-align:center">').appendTo(tr);
        var bLeft= $('<div class="e-icon arrow-circle-left">').appendTo(th);
        var pages = Math.ceil(self.options.rows.length!=0 ? self.options.rows.length / self.options.pageSize: 1);
        for(var i=1; i<=pages;i++){
          var page=null;
          if(actualPage==i){
            page= $('<span class="e-page e-active">' + i + '</span>').appendTo(th);
          }
          else{
            page= $('<span class="e-page">' + i + '</span>').appendTo(th);
          }
          $(page).on('click', function(){
            var newPage=$(this).text();
            if(newPage!=actualPage){
              actualPage=newPage;
              draw();
            }
          })
        }

        var bRight= $('<div class="e-icon arrow-circle-right">').appendTo(th);

        if(actualPage==1){
          $(bLeft).addClass('e-disabled');
        }
        if(actualPage==pages){
          $(bRight).addClass('e-disabled');
        }

        $(bLeft).on('click', function(){
          if(actualPage!=1){
            actualPage--;
            draw();
          }
        })

        $(bRight).on('click', function(){
          if(actualPage!=pages){
            actualPage++;
            draw();
          }
        })
      }
    }
  }
  var loadTab= function(item){
      var index= item.attr('data-index');
      var content= item.closest('.e-menu').find(".e-menu-tabs-content .e-item[data-index='" + index +"']");
      var url = $(item).attr('data-url');
      if (typeof url !== typeof undefined && url !== false) {
        $(content).html('Cargando. Espere...');
        $(content).load(url, function() {});
      }
  }
  $.extend({
    evy: function(){
      var init= function(){
        $.each($('.e-menu'), function( key, menu ) {
          //menu-bar
          if($(menu).hasClass('e-menu-bar') || $(menu).hasClass('e-menu-bar-xl')
            || $(menu).hasClass('e-menu-bar-sm') || $(menu).hasClass('e-menu-bar-md')
            || $(menu).hasClass('e-menu-bar-lg')
          ){
            $(menu).menuBar();
          }
          //menu-tab
          if($(menu).hasClass('e-menu-tab')){
            $(menu).menuTab();
          }
        });
      };
      init();
      return this;
    },
    openWindow: function(options){
      if(!options) options={};
      if(options.Url){
        var ewindow= $('<div>').appendTo('body');
        var overlay= $('<div class="e-overlay">').insertBefore(ewindow);
        if(options.Name)
          $(ewindow).attr('id', options.Name);
        var content= $('<div class="e-window-content">').appendTo(ewindow);
        //$.showWait();
        $(content).load(options.Url, function() {
          if(options.OnSuccess) options.OnSuccess.call(this);
          //$.hideWait();
          document.body.style.overflow = 'hidden';
          var documentTitle= document.title;
          if(options.State){
            window.history.pushState({path: options.State.NewUrl}, '', options.State.NewUrl);
            document.title=options.State.Title;
          }
          var eheader= $('<div class="e-window-header">').prependTo(ewindow);
          if(options.ClassHeader)
              $(eheader).addClass(options.ClassHeader);
          if(options.Title){
            var etitle= $('<div class="e-window-title">').appendTo(eheader);
            $(etitle).html(options.Title);
          }
          var ewindowoptions=$('<div class="e-window-options">').appendTo(eheader);
          var close= $('<div class="e-window-close">').appendTo(ewindowoptions);
          $(close).append('<i class="e-icon close"><i>');
          $('html').css('overflow-y', 'hidden');
          $(ewindow).on("click", ".e-window-header .e-window-close" ,function() {
           if(options.OnClose) window[options.OnClose]();
           document.body.style.overflow = '';
           $(overlay).remove();
           $(ewindow).remove();
           if(options.State){
             window.history.back();
             document.title=documentTitle;
           }
           $('html').css('overflow-y', 'scroll');
         });
         $(ewindow).addClass('e-window');
         var width= options.Width ? options.Width : $(window).outerWidth(false);
         var height= options.Height ? options.Height : $(window).outerHeight(false);
         var top= $(window).outerHeight(false)>$(ewindow).outerHeight() ? ($(window).outerHeight(false) - $(ewindow).outerHeight())/2 : 0;
         var left= $(window).outerWidth(false)>$(ewindow).outerWidth() ? ($(window).outerWidth(false) - $(ewindow).outerWidth())/2 : 0;
         $(ewindow).css('top', top + 'px');
         $(ewindow).css('left', left + 'px');
         $(ewindow).css('max-width', $(window).outerWidth(false)>$(ewindow).outerWidth() ? $(ewindow).outerWidth() : $(window).outerWidth(false)-left-10);
         $(ewindow).css('height', $(window).outerHeight(false)>$(ewindow).outerHeight() ? $(ewindow).outerHeight() : $(window).outerHeight(false)-top-10);
         console.log($(ewindow).outerHeight());
         //$(content).css('max-width', $(ewindow).outerWidth());
         //$(content).css('max-height', $(ewindow).outerHeight(false)-$(eheader).outerHeight(true));
         $(content).css('max-height', $(ewindow).outerHeight(false)-$(eheader).outerHeight(false));
       });
      }
    },
    closeWindow: function(name){
      var w= null;
      if(name) w= $('#'+ name);
      else w=$('.e-window');
      $(w).prev().remove();
      $(w).remove();
      if($('.e-window').length==0){
        $('html').css('overflow-y', '');
      }
    },
    showConfirmMessage: function (options) {
      if(!options) options={};
      options.OnConfirm= options.OnConfirm ? options.OnConfirm : function () { };
      options.OnCancel= options.OnCancel ? options.OnCancel : function () { };
      var overlay= $('<div class="e-overlay">').appendTo('body');
      var ewindow= $('<div id="e-window">').appendTo('body');
      var eheader= $('<div class="e-window-header e-bg-orange">').prependTo(ewindow);
      $(eheader).append('<div class="e-window-title">'+ options.Title +'</div>');
      var content= $('<div class="e-window-content e-center">').appendTo(ewindow);
      $(content).append('<p>'+ options.Message +'</>');
      $(ewindow).addClass('e-window');
      var top= $(window).outerHeight(false)>$(ewindow).outerHeight() ? ($(window).outerHeight(false) - $(ewindow).outerHeight())/2 : 0;
      var left= $(window).outerWidth(false)>$(ewindow).outerWidth() ? ($(window).outerWidth(false) - $(ewindow).outerWidth())/2 : 0;
      $(ewindow).css('top', top + 'px');
      $(ewindow).css('left', left + 'px');
      buttons= $('<div class="e-row e-form-buttons">').appendTo(content);
      confirm= $('<input type="button" class="e-button e-bg-green" value="Aceptar"/>').appendTo(buttons);
      cancel= $('<input type="button" class="e-button e-bg-red" value="Cancelar"/>').appendTo(buttons);
      $(confirm).click(function () {
        options.OnConfirm();
        $(overlay).remove();
        $(ewindow).remove();
      });
      $(cancel).click(function () {
        options.OnCancel();
        $(overlay).remove();
        $(ewindow).remove();
      });
    },
    showMessage: function(message, options){
      if(!options) options={};
      options.Type= options.Type ? options.Type : 'None';
      options.Time= options.Time ? options.Time : 5000;
      var emessage= $('<div class="e-message">').appendTo('body');
      $(emessage).text(message);
      switch (options.Type) {
        case 'Success': $(emessage).addClass('e-bg-green'); break;
        case 'Danger': $(emessage).addClass('e-bg-red'); break;
        case 'Warning': $(emessage).addClass('e-bg-yellow'); break;
        case 'None': $(emessage).addClass('e-bg-blue'); break;
      }
      $(emessage).on('click', function () {
        $(this).remove();
      });
      setTimeout(function () {
        $(emessage).remove();
      }, options.Time);
    },
    showSuccessMessage: function (message) {
      this.showMessage(message, {Type: 'Success'});
    },
    showDangerMessage: function (message) {
      this.showMessage(message, {Type: 'Danger'});
    }
  });
  $.fn.menuBar=function (){
    var menu= $(this);
    var button= $('<div class="e-menu-bar-button"><i class="e-icon bars"></i></div>').insertAfter(menu);
    button.on('click', function(){
      if(menu.hasClass('e-menu-bar-open'))
      {
        menu.removeClass('e-menu-bar-open');
        button.css('color', 'inherit');
      }else{
        menu.addClass('e-menu-bar-open');
        button.css('color', menu.css('color'));
      }
    });
    menu.on('click', '.e-item',function(){
      if(menu.hasClass('e-menu-bar-open'))
      {
        menu.removeClass('e-menu-bar-open');
      }
    });
  };
  $.fn.menuTab=function (){
    var menu= $(this);
    var active= menu.find('.e-menu-tabs .e-active');
    loadTab(active);
    menu.find('.e-menu-tabs .e-item').on('click', function(){
      var item= $(this);
      var index= item.attr('data-index');
      menu.find('.e-menu-tabs-content .e-active').removeClass('e-active');
      var content= menu.find(".e-menu-tabs-content .e-item[data-index='" + index +"']").addClass('e-active');
      $(content).addClass('e-active');
      menu.find('.e-menu-tabs .e-active').removeClass('e-active');
      item.addClass('e-active');
      loadTab(item);
    });
  };
  $.fn.table = function(options){
    var el= this;
    if(!table){
      table= new Table();
    }
    if(options){
      table.el=this;
      table.options= options;
      table.render();
    }
    return table;
  };
} (jQuery));

// Hello Evy!!
$(document).ready(function() {
  var evy= $.evy();
});
