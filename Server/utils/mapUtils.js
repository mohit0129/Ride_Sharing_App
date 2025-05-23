// export const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371;
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// export const calculateFare = (distance) => {
//   const rateStructure = {
//     bike: { baseFare: 30, perKmRate: 25, minimumFare: 35 },
//     auto: { baseFare: 35, perKmRate: 27, minimumFare: 40 },
//     cabEconomy: { baseFare: 40, perKmRate: 30, minimumFare: 60 },
//     cabPremium: { baseFare: 50, perKmRate: 35, minimumFare: 80 },
//   };

//   const fareCalculation = (baseFare, perKmRate, minimumFare) => {
//     const calculatedFare = baseFare + distance * perKmRate;
//     return Math.max(calculatedFare, minimumFare);
//   };

//   return {
//     bike: fareCalculation(
//       rateStructure.bike.baseFare,
//       rateStructure.bike.perKmRate,
//       rateStructure.bike.minimumFare
//     ),
//     auto: fareCalculation(
//       rateStructure.auto.baseFare,
//       rateStructure.auto.perKmRate,
//       rateStructure.auto.minimumFare
//     ),
//     cabEconomy: fareCalculation(
//       rateStructure.cabEconomy.baseFare,
//       rateStructure.cabEconomy.perKmRate,
//       rateStructure.cabEconomy.minimumFare
//     ),
//     cabPremium: fareCalculation(
//       rateStructure.cabPremium.baseFare,
//       rateStructure.cabPremium.perKmRate,
//       rateStructure.cabPremium.minimumFare
//     ),
//   };
// };

// export const generateOTP = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// };

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateFare = (distance) => {
  const rateStructure = {
    bike: { baseFare: 20, perKmRate: 8, minimumFare: 30 },
    auto: { baseFare: 30, perKmRate: 10, minimumFare: 40 },
    cabEconomy: { baseFare: 40, perKmRate: 12, minimumFare: 50 },
    cabPremium: { baseFare: 50, perKmRate: 15, minimumFare: 70 },
  };

  const fareCalculation = (baseFare, perKmRate, minimumFare) => {
    const calculatedFare = baseFare + distance * perKmRate;
    return Math.max(calculatedFare, minimumFare);
  };

  return {
    bike: fareCalculation(
      rateStructure.bike.baseFare,
      rateStructure.bike.perKmRate,
      rateStructure.bike.minimumFare
    ),
    auto: fareCalculation(
      rateStructure.auto.baseFare,
      rateStructure.auto.perKmRate,
      rateStructure.auto.minimumFare
    ),
    cabEconomy: fareCalculation(
      rateStructure.cabEconomy.baseFare,
      rateStructure.cabEconomy.perKmRate,
      rateStructure.cabEconomy.minimumFare
    ),
    cabPremium: fareCalculation(
      rateStructure.cabPremium.baseFare,
      rateStructure.cabPremium.perKmRate,
      rateStructure.cabPremium.minimumFare
    ),
  };
};

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};