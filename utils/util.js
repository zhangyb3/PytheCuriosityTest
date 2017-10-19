

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

/*  
 *  
 *  格式化时间
 *  传入10位或者13位时间戳，返回格式yyyy/mm/dd hh:mm:ss
 *  @ time : number 
 *  
 */
function formatDate(time) {
  let _time = time
  if (typeof _time !== 'number' || _time < 0) {
    return _time
  }
  if (_time.toString().length === 10) {
    _time = parseInt(_time.toString().concat('000'))
  }

  let date = new Date(_time)

  return ([
    // date.getFullYear(), 
    date.getMonth() + 1, 
    date.getDate()
    ]).map(function(item) {
    let _item = item.toString()
    return _item[1] ? _item : '0'.concat(_item)
  }).join("-").concat(" ").
  concat(([
    date.getHours(), 
    date.getMinutes(),
    // date.getSeconds()
    ]).map(function(item) {
    let _item = item.toString()
    return _item[1] ? _item : '0'.concat(_item)
  }).join(":"))
}

function formatDay(time) {
  let _time = time
  if (typeof _time !== 'number' || _time < 0) {
    return _time
  }
  if (_time.toString().length === 10) {
    _time = parseInt(_time.toString().concat('000'))
  }

  let date = new Date(_time)

  return ([
    // date.getFullYear(), 
    date.getMonth() + 1, 
    date.getDate()
    ]).map(function(item) {
    let _item = item.toString()
    return _item[1] ? _item : '0'.concat(_item)
  }).join("-")
}

function formatHMS(time) {
  let _time = time
  if (typeof _time !== 'number' || _time < 0) {
    return _time
  }
  if (_time.toString().length === 10) {
    _time = parseInt(_time.toString().concat('000'))
  }

  let date = new Date(_time)

  return ([
    date.getHours(), 
    date.getMinutes(),
    //date.getSeconds()
    ]).map(function(item) {
    let _item = item.toString()
    return _item[1] ? _item : '0'.concat(_item)
  }).join(":")
}

function getDistance(lat1, lng1, lat2, lng2) 
{
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;

  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

  var r = 6378137;
  return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
}




module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  formatDate: formatDate,
  formatDay: formatDay,
  formatHMS: formatHMS,
  getDistance: getDistance,
}