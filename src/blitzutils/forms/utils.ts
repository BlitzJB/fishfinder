import React from "react";

interface BaseState {
    status: string
    _private_setStatus: React.Dispatch<any>
    value: any
    setValue: React.Dispatch<any>
}

interface BaseUseStateOptions {
    prefill?: string
}

function validate<T extends BaseState>(states: T[]): boolean {
    return states.every((state) => state.status === 'success');
}

function clear<T extends BaseState>(states: T[]): void {
    states.forEach(state => {
        if (state.value.isArray()) 
            state.setValue([])
        else if (typeof state.value == 'object')
            state.setValue({})
        else if (typeof state.value == 'boolean')
            state.setValue(false) // assume false is default
        else if (typeof state.value == 'number')
            state.setValue(0)
        else if (typeof state.value == 'string')
            state.setValue('')
        else 
            throw Error("unknown state type in state value clear " + typeof state.value)
        state._private_setStatus("untouched")
    })
}
export { validate, clear, type BaseState, type BaseUseStateOptions }