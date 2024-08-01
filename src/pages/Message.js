import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Message = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  console.log('socket connection', socketConnection);

  useEffect(() => {
    if (socketConnection && params?.userId) {
      console.log('userId retirved from path',params.userId)
      socketConnection.emit('message', params.userId);
    }
  }, [params.userId]);

  return (
    <div>Message</div>
  );
};

export default Message;
