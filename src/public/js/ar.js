function localizeJSON(url, varName) {
    var xmlhttp = new XMLHttpRequest();
    var url = "/locales/en_US/demo.json";

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var repsonse = JSON.parse(this.responseText);
            return response;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}