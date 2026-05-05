

// On submit, one addDoc call
await addDoc(collection(db, "prenotifications"), {
    hospitalId, vehicleId, paramedicId,
    patient: { age, sex, mechanism, chiefComplaint },
    gcs: { eyes, verbal, motor, total: e+v+m, severity },
    vitals: { bp, pulse, spo2 },
    eta: Timestamp.fromDate(etaDate),
    status: "incoming",
    notifiedAt: serverTimestamp()
  });