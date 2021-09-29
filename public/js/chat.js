const socket = io()

//elements
let $messageForm = document.querySelector('#messageForm')
let $messageBox = document.querySelector('#messageBox')
let $submitButton = document.querySelector('#submitButton')
let $shareLocationBtn = document.querySelector('#share-location')
let $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#message-location-url').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //height of the last messsage
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    // // containerHeight - newMessageHeight < scrollOffset
    if ((containerHeight - scrollOffset) / newMessageHeight < 4) {
        $newMessage.scrollIntoView()
    }
    console.log(containerHeight, ' ', newMessageHeight, ' ', scrollOffset)

}


socket.on('message', (obj) => {
    console.log(obj)

    const html = Mustache.render(messageTemplate, {
        message: obj.text,
        createdAt: moment(obj.createdAt).format('h:mm a'),
        username: obj.username
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (obj) => {
    console.log(obj)

    const html = Mustache.render(locationMessageTemplate, {
        location: obj.text,
        createdAt: moment(obj.createdAt).format('h:mm a'),
        username: obj.username
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

const resetForm = function () {
    $submitButton.removeAttribute('disabled')
    $messageBox.value = ''
    $messageBox.focus()
}

$messageForm.addEventListener('submit', (e) => {

    e.preventDefault()
    $submitButton.setAttribute('disabled', 'true')
    let message = e.target.elements.message.value

    if (message === "") {
        resetForm()
        return
    }

    //send client message to server socket
    socket.emit('messageFromClient', message, (error) => {
        resetForm()
        if (error) {
            return console.log(error)
        }
    })
})

$shareLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $shareLocationBtn.setAttribute('disabled:', 'true')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('shareClientLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $shareLocationBtn.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

