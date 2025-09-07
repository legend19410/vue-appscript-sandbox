const UtilityService = {

   getNavDropdownOptions(){
      return CONFIG.NAVIGATION_DROPDOWN
   },

  camelCaseToTitleCase(camelCaseStr) {
    if (!camelCaseStr) return '';
    return camelCaseStr
      // Add a space before capital letters
      .replace(/([A-Z])/g, ' $1')
      // Capitalize the first letter
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },

  isValidJSON(str) {
    if (typeof str !== "string") return false; // Only strings can be JSON
    try {
      const parsed = JSON.parse(str);
      // JSON must be an object, array, number, string, boolean, or null
      return typeof parsed === "object" || typeof parsed === "boolean" || typeof parsed === "number" || parsed === null;
    } catch (e) {
      return false;
    }
  },

  getDropdownOptions() {
    const dropdownRepository = new SheetORM(CONFIG.DROPDOWNS.SHEET_ID, CONFIG.DROPDOWNS.SHEET_NAME);

    const parseOptions = (tag, type) => {
      const raw = dropdownRepository
        .where(dr => dr.tag === tag && dr.type === type)
        .first()
        ?.dropdownOptions;

      return raw && this.isValidJSON(raw) ? JSON.parse(raw) : [];
    };

    return {
      navigationOptions:{
        navBarDropdownOptions: parseOptions('navigationOptions', 'navBarDropdownOptions'),
      },
      customerRequests:{
        stage: parseOptions('customerRequests', 'stage' ),
        priority: parseOptions('customerRequests', 'priority'),
        requestType: parseOptions('customerRequests', 'requestType'),
      }
    };
  }

}

function test78888h8(){
  const res = UtilityService.getDropdownOptions()
  console.log(res)
}
