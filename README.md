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

-- {String} title 		The title to be used in the dialog.
-- {String} okText		Text to be used on the Ok button.


##Events
list them here

##Methods

###modal.open()
Renders and opens the modal.

###modal.close()
Closes the modal and removes it from the DOM
