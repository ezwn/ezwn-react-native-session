
export default (endpoint) => ({
    findAll: async (fetch) => {
        try {
            const url = `${endpoint}`
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }

            throw new Error("Fetch error")
        } catch (error) {
            // console.log(">>> Backend not reachable.", JSON.stringify(error), error);
            throw error;
        }
    },
    save: async (fetch, item) => {
        try {
            const url = `${endpoint}`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            if (response.ok) {
                return;
            }

            throw new Error("Fetch error")
        } catch (error) {
            // console.log(">>> Backend not reachable.", JSON.stringify(error), error);
            throw error;
        }
    },
    delete: async (fetch, item) => {
        try {
            const url = `${endpoint}`
            const response = await fetch(url, {
                method: "DELETE",
                body: JSON.stringify(item),
                headers: {
                  'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                return;
            }

            throw new Error("Fetch error")
        } catch (error) {
            // console.log(">>> Backend not reachable.", JSON.stringify(error), error);
            throw error;
        }
    }
});
