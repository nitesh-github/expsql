const { format } = require('date-fns');
function formatDate(date, formatString = 'MMMM dd, yyyy') {
    return format(date, formatString);
}

module.exports={
    formatDate,
}