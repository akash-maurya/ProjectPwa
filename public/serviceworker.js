
importScripts("idb.js");
importScripts("utility.js");




self.addEventListener("sync", function (event) {
  console.log("  [Service Worker] Background Syncing  :)" + event);

  if (event.tag === "sync-new-profile") {
    console.log("syncing new profile");

    event.waitUntil(
      readallData("profile").then(function (data) {
        for (var dt of data) {
          const data = {
            firstname: dt.firstname,
            lastname: dt.lastname,
            address: dt.address,
          };
          console.log(data);
          const hitUrl = "http://localhost:5000/api/update/updateDetails";
          // const authToken = cookies.get("authToken");
          const header = {
            "Content-Type": "application/json",
            authToken: dt.authToken,
          };

          if (dt.authToken) {
            fetch(hitUrl, {
              method: "PUT",
              headers: header,
              body: JSON.stringify(data),
            })
              .then((res) => {
                console.log("res data" + res.json());

                deleteItem("profile", dt.authToken);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
    );
  }
});
