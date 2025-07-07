export const rooms_arr = [];

export const addRoom = (roomName) => {
  rooms_arr.push(roomName);
  return roomName;
};

export const getRoom = (roomName) => {
  return rooms_arr.find(roomName) ? roomName : addRoom(roomName);
};
