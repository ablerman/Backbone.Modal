(function($, _, Backbone) {
    "use strict";

    var modalTemplate = '';
    modalTemplate += '<div class="modal-header"></div>';
    modalTemplate += '<div class="modal-body"></div>';
    modalTemplate += '<div class="modal-footer"></div>';

    var headerTemplate = '';
    headerTemplate +=   '<a class="close">&times;</a>';
    headerTemplate +=   '<h5><%= title %></h5>';

    var footerTemplate = '';
    footerTemplate +=   '<button class="btn ok pull-left"><i class="icon-ok" style="color:green;">&nbsp;</i><%= okText %></button>'
    footerTemplate +=    '<% if (allowCancel) { %>';
    footerTemplate +=        '<% if (cancelText) { %>';
    footerTemplate +=            '<button class="btn cancel btn-link pull-left"><%= cancelText %></button>';
    footerTemplate +=        '<% } %>';
    footerTemplate +=    '<% } %>';



    var Modal = Backbone.View.extend({
        title       : "Default Title",
        okText      : 'OK',
        cancelText  : 'cancel',
        modalTemplate   : modalTemplate,
        footerTemplate  : footerTemplate,
        headerTemplate  : headerTemplate,
        events: {
            'click .close': function(event) {
                event.preventDefault();
                this.trigger('cancel');
                this.close();
            },
            'click .cancel': function(event) {
                event.preventDefault();
                this.trigger('cancel');
                this.close();
            },
            'click .ok': function(event) {
                event.preventDefault();
                this.trigger('ok');

                if (this.options.okCloses) {
                    this.close();
                }
            }
        },
        initialize  : function(options) {
            this.options = _.extend({
                title: this.title,
                okText: 'OK',
                focusOk: true,
                okCloses: true,
                cancelText: 'Cancel',
                allowCancel: true,
                escape: true,
                animate: false,
                modalTemplate: this.modalTemplate,
                headerTemplate : this.headerTemplate,
                footerTemplate : this.footerTemplate,
                backdrop:true
            }, options);

            this.$footer = null
            this.$header = null;
            
            if( this.contentInitialize ) {
                this.contentInitialize(options);
            }
        },
        delegateModalEvents : function(events){
            // had to copy this in here too
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;

            // this is just a copy of the delegateEvents from the backbone source with $el replaced with $modalEl
            if (!(events || (events = _.result(this, 'events')))) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) continue;

                var match = key.match(delegateEventSplitter);
                var eventName = match[1], selector = match[2];
                method = _.bind(method, this);
                eventName += '.delegateEvents' + this.cid;
                if (selector === '') {
                    this.$modalEl.on(eventName, method);
                } else {
                    this.$modalEl.on(eventName, selector, method);
                }
            }
            return this;
        },
        render      : function() {
            this.$modalEl = $('<div/>').addClass('modal');                
            var $modalEl = this.$modalEl;
            var options = this.options;

            //Create the modal container
            var template = _.template(this.options.modalTemplate);
            $modalEl.html( template(options) );

            template = _.template(this.options.footerTemplate);
            this.$footer = $modalEl.find('.modal-footer');
            this.$footer.html(template(options));

            template = _.template(this.options.headerTemplate);
            this.$header = $modalEl.find('.modal-header');
            this.$header.html(template(options));


            $modalEl.find('.modal-body').html(this.$el);
            if( this.contentRender ) {
                this.contentRender.call(this);
            }

            if (options.animate) {
                $modalEl.addClass('fade');
            }

            this.isRendered = true;

            return this;
        },
        open        : function() {
            
            if (!this.isRendered) {
                this.render();
            }
            this.delegateModalEvents(this.events);
            
            var self = this;
            var $modalEl = this.$modalEl;

            $modalEl.one('show', function() {
                self.trigger('show');
            });
            
            //Focus OK button
            $modalEl.one('shown', function() {
                if (self.options.focusOk) {
                    $modalEl.find('.btn.ok').focus();
                }
                self.trigger('shown');
            });

            $modalEl.one('hidden', function() {
                self.trigger('hidden');
            });
            
            $modalEl.one('hide', function() {
                self.trigger('hide');
            });
            
            //Create it
            $modalEl.modal({
                keyboard    : this.options.allowCancel,
                backdrop    : this.options.backdrop
            });
            
            //Adjust the modal and backdrop z-index; for dealing with multiple modals
            var numModals = Modal.count;
            var $backdrop = $('.modal-backdrop:eq('+numModals+')');
            var backdropIndex = parseInt($backdrop.css('z-index'),10);
            var elIndex = parseInt($backdrop.css('z-index'), 10);

            $backdrop.css('z-index', backdropIndex + numModals);
            $modalEl.css('z-index', elIndex + numModals);

            if (this.options.allowCancel) {
                $backdrop.one('click', function() {
                    if (self.options.content && self.options.content.trigger) {
                        self.options.content.trigger('cancel', self);
                    }

                    self.trigger('cancel');
                });

                $(document).one('keyup.dismiss.modal', function (e) {
                    e.which == 27 && self.trigger('cancel');

                    if (self.options.content && self.options.content.trigger) {
                        e.which == 27 && self.options.content.trigger('shown', self);
                    }
                });
            }

            this.on('cancel', function() {
                self.close();
            });

            Modal.count++;

            return this;
        },
        close       : function() {
            this.$modalEl.modal('hide');
            this.undelegateEvents();
            // don't forget to user remove after we've hidden it
            this.remove();
            Modal.count--;            

        },
        remove      : function() {
            this.$modalEl.remove();
            this.stopListening();
            return this;
        }
    });
    Modal.count = 0;
    
    // I need to override extend, do it like this:
    // http://stackoverflow.com/questions/12356531/how-does-one-override-the-extend-method-in-backbone
    var stockExtend = Backbone.View.extend;

    // fix extend to use my extend
    Modal.extend = function(protoProps, staticProps) {
        // from here: http://stackoverflow.com/questions/8596861/super-in-backbone
        var fn = stockExtend;

        protoProps['contentRender'] = protoProps['render'];
        delete protoProps['render'];

        protoProps['contentInitialize'] = protoProps['initialize'];
        delete protoProps['initialize'];

        return  fn.call(this, protoProps, staticProps);
    }


    

  //EXPORTS
  //CommonJS
  if (typeof require == 'function' && typeof module !== 'undefined' && exports) {
    module.exports = Modal;
  }

  //AMD / RequireJS
  if (typeof define === 'function' && define.amd) {
    return define(function() {
      Backbone.Modal = Modal;
    })
  }

  //Regular; add to Backbone.Modal
  else {
    Backbone.Modal = Modal;
  }

})(jQuery, _, Backbone);
