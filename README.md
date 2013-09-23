Backbone.Modal
==============

- Bridges between Twitter Bootstrap and Backbone

##Usage

    var ModalView = new Backbone.Modal.extend({
        [ Put the details of your modal view here ]
    });
    new ModalView().open();

##Configuration
Each of these can be either static on the class or passed in at instantiation.

- {String} title The title to be used in the dialog.
- {String} okText Text to be used on the Ok button.
- {String} cancelText Text to be used on the cancel button.
- {String} modalTemplate String to use as the modal template. ( uses _.template )
- {String} headerTemplate String to use as the template for the header. ( uses _.template )
- {String} footerTemplate String to use as the template for the header. ( uses _.template )

##Additional members
- $modalEl Makes the modal element available.
- $footer Makes the footer element available.
- $header Makes the header element available.

##Events
Events are handled using the typical events{} dictionary.

- 'click .close' Triggered by the close button.
- 'click .cancel' Triggered by the cancel button.
- 'click .ok' Triggered by the ok button.

##Methods

###modal.open()
Renders and opens the modal.

###modal.close()
Closes the modal and removes it from the DOM

Example: 
http://jsfiddle.net/ablerman/vDtmr/12/
