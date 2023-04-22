'use strict'
export default {
    namespaced: true,
	state: {   
        EditCodes : "",
    },
    mutations: {
        InsertEditCodes(state, payload){
            payload = "\n" + payload;
            state.EditCodes += payload;
		},
        ClearEditCodes(state, payload){
            payload = "";
            state.EditCodes = payload;
		},        
        UpdateEditCodes(state, payload){			
            state.EditCodes = payload;
		},
    },
}
