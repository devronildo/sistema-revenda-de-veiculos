export const actionTypes = {
    SCREEN_A: 'CHANGE_SCREEN_A',
    SCREEN_B: 'CHANGE_SCREEN_B',
    SCREEN_C: 'CHANGE_SCREEN_C',
}

export const changeScreenA = (payload) => ({
    type: actionTypes.SCREEN_A,
    payload
})

export const changeScreenB = (payload) => ({
   type: actionTypes.SCREEN_B,
   payload
})

export const changeScreenC = (payload) => ({
   type: actionTypes.SCREEN_C,
   payload
})