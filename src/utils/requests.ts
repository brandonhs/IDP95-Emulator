export function makeRequest(method: string, url: string) {
    return new Promise<ArrayBuffer>(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

export function getSvg(svgUrl: string) {
    return new Promise<Document>(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'document';
        xhr.open('GET', svgUrl);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(this.responseXML);
            }
        };
        xhr.send();
    });
}

export function getImage(url: string) {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        let image = new Image();
        image.src = url;
        image.onload = function() {
            resolve(image);
        }

        image.onerror = function(e) {
            reject(e);
        }
    });
}


