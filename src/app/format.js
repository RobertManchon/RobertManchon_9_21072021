export const formatDate = (dateStr) => {
  //TEMP FIX: there are invalid Dates in the DB and it makes the bill's page crash
  if (Date.parse(dateStr) === NaN || dateStr === "") {
    console.log("Date incorrecte: "+ dateStr);
    return "1 Jan. 01";
  }

  // Dates modified to english format - WIP03
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

  
  