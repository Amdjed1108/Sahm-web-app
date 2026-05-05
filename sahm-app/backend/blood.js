const COMPATIBLE_WITH = {
    'O−':  ['O−','O+','A−','A+','B−','B+','AB−','AB+'],
    'O+':  ['O+','A+','B+','AB+'],
    'A−':  ['A−','A+','AB−','AB+'],
    'A+':  ['A+','AB+'],
    'B−':  ['B−','B+','AB−','AB+'],
    'B+':  ['B+','AB+'],
    'AB−': ['AB−','AB+'],
    'AB+': ['AB+'],
  };
  // When doctor requests blood for patient with type X,
  // query bloodInventory where bloodType is in COMPATIBLE_WITH[X]

