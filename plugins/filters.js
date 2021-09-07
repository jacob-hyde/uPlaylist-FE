import Vue from "vue"
import moment from "moment"

Vue.filter("capitalize", (val) => val.toUpperCase())
Vue.filter("formatDate", function (value) {
  if (value) {
    return moment(String(value)).format("MM/DD/YYYY")
  }
})
Vue.filter("formatTimeTo12Hrs", function (value) {
  if (value) {
    return moment(String(value), ["HH.mm"]).format("hh:mm a")
  }
})

Vue.filter("formatDateTime", function (value) {
  if (value) {
    return moment(value).format("MM-DD-YYYY hh:mm:ss a")
  }
})

Vue.filter("timeToSeconds", function (value) {
  const a = value.split(":")
  return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
})

Vue.filter("centsToDollar", function (value) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })
  return formatter.format(value / 100)
})

Vue.filter("formatDateWithMonthName", function (value) {
  return moment(value).format("MMMM DD, YYYY")
})

Vue.filter("conjuction", function (arr) {
  const conjunction = "and"
  const ifempty = "N/A"
  const l = arr.length
  if (!l) return ifempty
  if (l < 2) return arr[0]
  if (l < 3) return arr.join(` ${conjunction} `)
  arr = arr.slice()
  arr[l - 1] = `${conjunction} ${arr[l - 1]}`
  return arr.join(", ")
});
