const valueSearch = window.location.pathname.includes("search") ? window.location.pathname.split("/").pop() : "";
if (valueSearch) {
    $(".js-search-input").val(valueSearch);
}

$(".js-search-input").on("change", (e) => {
    const value = e.target.value;
    $(".js-search-form").attr("action", `/search/${value}`);
    $(".js-search-form").submit();
});