import { actor, update, enterZone } from "@meta/actor";
import { app } from "@meta/app";
import { debug } from "@meta/debug";

import world from "../lib/world";

export default app!(() => {
    actor!("car", (self) => {
        update!(() => {
            debug!("hello", self.id, self.position);
        });
    });

    actor!("semaphore", (self) => {
        world.defineZone(self.position, 10);
    });
});
