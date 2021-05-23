export const actionTypes = {
    CHANGE: 'CHANGE_ALERT'
}

export const changeAlert = (payload) => ({
     type: actionTypes.CHANGE,
     payload
})