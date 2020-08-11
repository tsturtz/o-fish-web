import moment from "moment";

export default class VesselDataHelper {

  constructor(permitNumber, boardings){
      this.permitNumber = permitNumber;
      this.boardings = boardings;
  }

  getPermitNumbers(){
    const collection = {};
    this.boardings.forEach((boarding) => {
      if (boarding.vessel && boarding.vessel.permitNumber){
        collection[boarding.vessel.permitNumber] = null
      }
    });
    return Object.keys(collection);
  }

  getVesselNames(){
    const collection = {};
    this.boardings.forEach((boarding) => {
      if (boarding.vessel && boarding.vessel.name){
        collection[boarding.vessel.name] = null
      }
    });
    return Object.keys(collection);
  }

  getBoardings() {
    return this.boardings.map((boarding) => {
      const violations = boarding.inspection.summary.violations ? boarding.inspection.summary.violations: [];
      return {
        date: moment(boarding.date).format("MM/DD/yyyy"),
        time: moment(boarding.date).format("LT"),
        agency: boarding.agency && boarding.agency.name ? boarding.agency.name: boarding.agency,
        violations: violations.length,
        citations: violations.length,
        warnings: violations.length,
        risk: boarding.inspection.summary.safetyLevel.level,
        boardedBy: boarding.reportingOfficer && boarding.reportingOfficer.name ?  boarding.reportingOfficer.name.first + " " + boarding.reportingOfficer.name.last : ""
      }
    });
  }

  getNationalities() {
    const collection = {};
    this.boardings.forEach((boarding) => {
      if (boarding.vessel.nationality){
        collection[boarding.vessel.nationality] = null
      }
    });
    return Object.keys(collection);
  }


  getHomePorts() {
      const collection = {};
      this.boardings.forEach((boarding) => {
        if (boarding.vessel.homePort){
          collection[boarding.vessel.homePort] = null
        }
      });
      return Object.keys(collection);
  }

  getCaptains() {
    const collection = [];
    this.boardings.forEach((boarding) => {
      if (!collection.find(c=> c.license === boarding.captain.license)){
        collection.push({
          license : boarding.captain.license,
          name :  boarding.captain.name
        });
      }
    });
    return collection;
  }

  getViolations() {
    const collection = [];
    this.boardings.forEach((boarding) => {
      if (boarding.inspection && boarding.inspection.summary && boarding.inspection.summary.violations){
        const violation = boarding.inspection.summary.violations;
        collection.push({
            violation:violation.offence ? violation.offence.explanation : "",
            vessel: boarding.vessel ? boarding.vessel.name : "",
            result: violation.disposition,
            boardingDate: moment( boarding.date).format("MM/DD/yyyy")
        });
      }
    });
    return collection;
  }

  getCrew() {
    const collection = [];
    this.boardings.forEach((boarding) => {
      if (boarding.crew && boarding.crew.length){
        boarding.crew.forEach((crewMember) => {
          if (!collection.find(c=> c.license == crewMember.license)){
            collection.push({
              license : crewMember.license,
              name :  crewMember.name,
              photos: crewMember.attachments ? crewMember.attachments.photoIDs: [],
              notes: crewMember.attachments ? crewMember.attachments.notes: [],
            });
          }
        });
      }
    });
    return collection;
  }

  getDeliveries() {
    const collection = [];
    this.boardings.forEach((boarding) => {
      if (boarding.vessel && boarding.vessel.lastDelivery){
        collection.push({
            location:boarding.vessel.lastDelivery.location,
            business: boarding.vessel.lastDelivery.business,
            date: moment( boarding.vessel.lastDelivery.date).format("MM/DD/yyyy")
        });
      }
    });
    return collection;
  }

  getPhotos() {
    const collection = [];
    this.boardings.forEach((boarding) => {
      if (boarding.notes && boarding.notes.length){
        boarding.notes.forEach((note) => {
            collection.push({
              photo: note.photoID,
              date: moment( boarding.vessel.lastDelivery.date).format("MM/DD/yyyy")
            });
        });
      }
    });
    return collection;
  }

    getNotes() {
      const collection = [];
      this.boardings.forEach((boarding) => {
        if (boarding.notes && boarding.notes.length){
          boarding.notes.forEach((note) => {
              collection.push({
                note: note.note,
                date: moment( boarding.vessel.lastDelivery.date).format("MM/DD/yyyy")
              });
          });
        }
      });
      return collection;
    }
}