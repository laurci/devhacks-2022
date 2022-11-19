import { getAppFactories } from "@meta/app";
import { debug } from "@meta/debug";

export async function initApplications(filter?: string) {
    const appFactories = getAppFactories!();

    let runningApplications = 0;
    defer {
        debug!(appFactories.length, runningApplications);
    }


    for (const appFactory of appFactories) {
        if (filter) {
            if (appFactory.name != filter) {
                continue;
            }
        }
        runningApplications++;
        await appFactory.mod();
    }
}
