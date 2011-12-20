function parseDate(dateStr){
    return new Date(parseInt(dateStr.substring(0,dateStr.indexOf('-'))),
                        parseInt(parseFloat(dateStr.substring(dateStr.indexOf('-')+1, dateStr.lastIndexOf('-'))))-1,
                        parseInt(parseFloat(dateStr.substring(dateStr.lastIndexOf('-')+1, dateStr.length))));
}

// calculate number of days between any two dates
function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)
    
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}
