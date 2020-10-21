import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

import { client } from '../../api/client'

const notificationAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    // on first call the array is empty
    const allNotifications = selectAllNotifications(getState())
    // get first notification from the array which is the latest by date
    const [latestNotification] = allNotifications
    // extract the date of the latest notification so on the next call we don't get the same notifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
    return response.notifications
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state) {
      // state.forEach(notification => {
      //   notification.read = true
      // })
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    }
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      // state.forEach(notification => {
      //   notification.isNew = !notification.read
      // })
      // state.push(...action.payload)
      // state.sort((a, b) => b.date.localeCompare(a.date))
      Object.values(state.entities).forEach(notification => {
        notification.isNew = !notification.read
      })
      notificationAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

// export const selectAllNotifications = state => state.notifications
export const {
  selectAll: selectAllNotifications
} = notificationAdapter.getSelectors(state => state.notifications)