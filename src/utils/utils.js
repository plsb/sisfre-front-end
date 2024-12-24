// src/utils/utils.js
const moment = require('moment');

export const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
};
