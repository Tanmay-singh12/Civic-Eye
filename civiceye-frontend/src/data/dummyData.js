export const users = [
  {
    id: "U001",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    password: "123456",
    role: "citizen",
  },
  {
    id: "U002",
    name: "Priya Patil",
    email: "priya@gmail.com",
    password: "123456",
    role: "citizen",
  },
];

export const complaints = [
  {
    id: "CE-1042",
    citizenId: "U001",
    title: "Blocked Drain",
    category: "Drainage",
    status: "In Progress",
    priorityScore: 87,

    location: {
      address: "Dharampeth, Nagpur",
      latitude: 21.1458,
      longitude: 79.0882,
    },

    aiAnalysis: {
      issue: "Blocked Drain",
      confidence: 94,
      severity: "HIGH",
      department: "Public Health Engineering",
    },
  },
];