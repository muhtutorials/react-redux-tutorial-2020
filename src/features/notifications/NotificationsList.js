import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllNotifications, allNotificationsRead } from './notificationsSlice'
import { selectAllUsers } from '../users/usersSlice'

export const NotificationsList = () => {
  const dispatch = useDispatch()

  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  useEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || { name: 'Unknown user' }

    const notificationClassName = classnames('notification', { new: notification.isNew })

    return (
      <div key={notification.id} className={notificationClassName}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notification">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}