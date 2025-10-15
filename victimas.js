use victimasMinas

db.Victimas.aggregate([
    {
      $group: {
        _id: "$codigodanedepartamento",
        nombreDepartamento: { $first: "$departamento" }
      }
    },
    {
      $project: {
        _id: 0,
        nombreDepartamento: 1,
        codDepartamento: "_id"
      }
    },
    { $out: "Departamento" }
  ]);
  

  db.Victimas.aggregate([
    {
      $group: {
        _id: "$codigodanemunicipio",
        nombreMunicipio: { $first: "$municipio" },

        codDepartamento: { $first: "$codigodanedepartamento" }
      }
    },
    {
      $lookup: {
        from: "Departamento",
        localField: "codDepartamento",
        foreignField: "codDepartamento",
        as: "dep"
      }
    },
    { $unwind: "$dep" },
    {
      $project: {
        _id: 0,
        nombreMunicipio: 1,
        codMunicipio: "_id",
        idDepartamento: "$dep._id"
      }
    },
    { $out: "Municipio" }
  ]);

  
  db.Victimas.aggregate([
    {
      $group: {
        _id: "$sitio",
        nombreSitio: { $first: "$sitio" },
        municipio: { $first: "$municipio" },
        latitudCabecera: { $first: "$latitud" },
        longitudCabecera: { $first: "$longitud" }
      }
    },
    {
      $lookup: {
        from: "Municipio",
        localField: "municipio",
        foreignField: "nombreMunicipio",
        as: "mun"
      }
    },
    { $unwind: "$mun" },
    {
      $project: {
        _id: 0,
        nombreSitio: 1,
        latitudCabecera: 1,
        longitudCabecera: 1,
        idMunicipio: "$mun._id"
      }
    },
    { $out: "Sitio" }
  ]);

  
  db.Victimas.aggregate([
    {
      $project: {
        _id: 0,
        idVictima: "$_id",
        rangoEdad: 1,
        grupoEtnico: 1,
        condicion: 1,
        estado: 1,
        genero: 1
      }
    },
    { $out: "Victima_Normalizada" }
  ]);
  

  db.Victimas.aggregate([
    {
      $lookup: {
        from: "Sitio",
        localField: "sitio",
        foreignField: "nombreSitio",
        as: "s"
      }
    },
    { $unwind: "$s" },
    {
      $lookup: {
        from: "Victima_Normalizada",
        localField: "_id",
        foreignField: "idVictima",
        as: "v"
      }
    },
    { $unwind: "$v" },
    {
      $project: {
        _id: 0,
        año: 1,
        mes: 1,
        tipoEvento: 1,
        ubicacion: 1,
        actividad: 1,
        idSitio: "$s.idSitio",
        idVictima: "$v.idVictima"
      }
    },
    { $out: "Evento" }
  ]);
