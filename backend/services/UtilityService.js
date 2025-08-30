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
  }

}
