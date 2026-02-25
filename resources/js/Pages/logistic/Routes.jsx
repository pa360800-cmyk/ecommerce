import { Head } from "@inertiajs/react";
import LogisticsSidebar from "./sidebar";
import LogisticsHeader from "./header";

export default function Routes({ auth }) {
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LogisticsSidebar />
            <div className="flex-1 flex flex-col">
                <LogisticsHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Route Map - Logistic" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Route Map
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View delivery routes
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <p className="text-gray-600">
                            Route map will be displayed here.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
