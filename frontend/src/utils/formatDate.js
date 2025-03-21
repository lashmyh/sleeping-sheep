// function takes iso string date returns it in desired format
export const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-GB", {
        weekday: "short", 
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
