/* eslint-disable import/no-anonymous-default-export */
export default [
    ...Array.from({ length: 5000 }, (_, i) => {
        const doctors = [
            "Mary Johnson",
            "Michael Spears",
            "Samantha Benitez",
            "William Bradley",
            "Elizabeth Carter",
        ];
        const treatments = [
            "Cavity Filling",
            "Root Canal",
            "Dental Implant",
            "Whitening",
            "Teeth Cleaning",
            "Periodontal Surgery",
            "Dental Crown",
            "Gum Treatment",
            "Orthodontic Braces",
        ];
        const statuses = [
            ...Array(5).fill("Completed"),
            ...Array(3).fill("Scheduled"),
            "Cancelled",
            "No Show",
        ];
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-12-31");

        const busyMonths = [1, 5, 10];
        const quietMonths = [2, 8];

        const appointmentDate = (() => {
            const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            const month = date.getMonth();

            if (busyMonths.includes(month)) {
                return new Date(
                    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
                );
            }
            if (quietMonths.includes(month)) {
                return new Date(
                    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()) / 2
                );
            }
            return date;
        })();

        const repeatVisitProbability = 0.3;
        const isRepeatVisit = Math.random() < repeatVisitProbability;
        const repeatCount = isRepeatVisit ? Math.floor(Math.random() * 4) + 2 : 1;

        const providerOutlier = Math.random() < 0.2;
        const provider = providerOutlier
            ? "Michael Spears"
            : doctors[Math.floor(Math.random() * doctors.length)];

        const dominantTreatmentProbability = 0.1;
        const isOutlier = Math.random() < 0.01;
        const price = isOutlier
            ? parseFloat((Math.random() * 10000 + 5000).toFixed(2))
            : parseFloat((Math.random() * 3000 + 200).toFixed(2));
        const balance = isOutlier
            ? parseFloat((Math.random() * 5000).toFixed(2))
            : parseFloat((Math.random() * 1000).toFixed(2));

        const patientId = `P${String(i + 1).padStart(4, "0")}`;
        return Array.from({ length: repeatCount }, () => ({
            patientId,
            provider,
            treatment:
                Math.random() < dominantTreatmentProbability
                    ? "Root Canal"
                    : treatments[Math.floor(Math.random() * treatments.length)],
            price,
            balance,
            appointmentDate: appointmentDate.toISOString().split("T")[0],
            appointmentStatus: statuses[Math.floor(Math.random() * statuses.length)],
        }));
    }).flat(),
];
