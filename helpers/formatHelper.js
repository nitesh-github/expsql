const { format } = require('date-fns');
function formatDate(date, formatString = 'MMMM dd, yyyy') {
    return format(date, formatString);
}
function baseUrl(){
    return baseUrl = process.env.BASE_URL;
}

module.exports={
    formatDate,
    baseUrl,
}