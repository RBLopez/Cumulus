({
    /**
     * @description: instantiates component. Only called when component is first loaded.
     */
    doInit: function (component, event) {
        var action = component.get('c.isOrgNamespaced');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var isOrgNamespaced = JSON.parse(response.getReturnValue());
                if (isOrgNamespaced) {
                    var listViewNamespaced = {
                        'objectApiName': 'npsp__DataImportBatch__c',
                        'listName': 'npsp__Gift_Batches',
                        'isLoaded': true
                    };
                    component.set('v.listView', listViewNamespaced);
                } else {
                    var listViewUnnamespaced = {
                        'objectApiName': 'DataImportBatch__c',
                        'listName': 'Gift_Batches',
                        'isLoaded': true
                    };
                    component.set('v.listView', listViewUnnamespaced);
                }
            } else {
                this.showToast(component, $A.get('$Label.c.PageMessagesError'), response.getReturnValue(), 'error');
                component.find('notifLib').showToast({
                    'variant': 'error',
                    'mode': 'sticky',
                    'title': $A.get('$Label.c.PageMessagesError'),
                    'message': response.getReturnValue()
                });
            }
        });
        $A.enqueueAction(action);
    },

    /**
     * @description: creates the configuration modal
     */
    openNewBatchWizard:function(component, event) {
        var modalBody;
        var modalHeader;
        var modalFooter;

        $A.createComponents([
                ['c:BGE_ConfigurationWizard', {sObjectName: 'DataImportBatch__c'}],
                ['c:modalHeader', {header: $A.get('$Label.c.bgeBatchInfoWizard')}],
                ['c:modalFooter', {}]
            ],
            function(components, status, errorMessage){
                if (status === 'SUCCESS') {
                    modalBody = components[0];
                    modalHeader = components[1];
                    modalFooter = components[2];
                    component.find('overlayLib').showCustomModal({
                        body: modalBody,
                        header: modalHeader,
                        footer: modalFooter,
                        showCloseButton: true,
                        cssClass: 'slds-modal_large'
                    })
                } else {
                    this.showToast(component, $A.get('$Label.c.PageMessagesError'), errorMessage, 'error');
                }
            }
        );
    }

})