export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT = 'LOGOUT'
export const CLEAR_DATA = 'CLEAR_DATA'

export function fetchUser() {
    return dispatch => {
        return fetch('/api/user/', {
            credentials: 'same-origin',
        }).then(
            response => response.json(),
            error => console.log('An error occurred.', error)
        ).then(json => {
            if (json.is_authenticated)
                dispatch({type: 'LOGIN_SUCCESSFUL', data: json.user})
        })
    }
}

export function login(username, password) {
    return dispatch => {
        /* Should be https */
        return fetch('/api/login/',
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  credentials: 'same-origin',
                  body: JSON.stringify({
                      username: username,
                      password: password
                  })
              })
            .then(
                res => {
                    const status = res.status;
                    res.json().then(json => {
                        if (status === 200) {
                            dispatch({type: 'LOGIN_SUCCESSFUL', data: json});
                        } else {
                            dispatch({type: 'LOGIN_FAILED', data: json});
                        }
                    })
                },
                error => console.log('An error occurred.', error)
            )
    }
}

export function logout() {
    return dispatch => {
        return fetch('/api/logout/',
              {
                  method: 'GET',
                  credentials: 'same-origin',
              })
            .then(
                res => {
                    if (res.status === 200) {
                        dispatch({type: 'LOGOUT'});
                    } else {
                        console.log('Logout failed', res)
                    }
                },
                error => console.log('An error occurred.', error)
            )
    }
}

export function clearData() {
    return dispatch => dispatch({type: 'CLEAR_DATA'});
}
