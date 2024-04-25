class TeamRepository {    
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.dbInitialized = false;
    }

    async init() {
        if (!this.dbInitialized) {
            this.db = await this.openDB(this.dbName, this.version);

            this.dbInitialized = true;
        }
    }
    async openDB(name, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                const objectStore = db.createObjectStore("teamMembers", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("by_team", "team");
                objectStore.transaction.oncomplete = () => resolve(db);
            };
        });
    }

    async addItems(storeName, items) {
        await this.init();

        const transaction = this.db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        for (const item of items) {
            await new Promise((resolve, reject) => {
                const request = objectStore.add(item);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    }

    async getAllItems(storeName) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getTeamMembersByTeam(storeName, teamName) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const index = objectStore.index("by_team");
            const request = index.getAll(teamName);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

teamRepository = new TeamRepository("teamMembers", 2);
