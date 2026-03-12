router.post('/verify', async (req, res) => {
    try {
        const { patientHash, attributeHash } = req.body;

        // Find ALL matching records to build the historical log
        const matchingRecords = await Record.find({ patientHash, attributeHash });

        if (matchingRecords.length > 0) {
            return res.json({
                verified: true,
                reports: matchingRecords.map(r => ({ hospital: r.hospital, date: r.timestamp }))
            });
        }
        res.json({ verified: false });
    } catch (err) {
        res.status(500).json({ error: "Audit retrieval failed" });
    }
});