import { observable } from "mobx";
import axios from 'axios';
import lunr from 'lunr';

/**
 * Encapsulate all State Variables for the Application.
 */
export default class cBioPortalState {
  @observable studyList = [];
  @observable geneList = [];
  @observable searchText = "";
  @observable searchResultsGenes = [];
  @observable searchResultsStudies = [];
  @observable currentGeneList = [];
  @observable currentGeneListStr = [];
  @observable currentStudySelected = null;
  @observable searchResultsSummary = "";
  @observable studyGroupSelected = 0;
  @observable examplesDrawerOpen = false;
  @observable optionsDialogOpen = false;
  cancerTypesDict = [];
  studyDict = [];
  idx;  //Lunx search index

  constructor(props) {
    this.initStudyRequest = this.initStudyRequest.bind(this);
    this.initCancerGeneCensusRequest = this.initCancerGeneCensusRequest.bind(this);
    this.initCancerTypesRequest = this.initCancerTypesRequest.bind(this);
    this.initLunrIndex = this.initLunrIndex.bind(this);
    setTimeout(this.initCancerTypesRequest, 0);
    setTimeout(this.initCancerGeneCensusRequest, 0);
  }

  /**
   * Get Cancer Studies JSON.
   */
  initStudyRequest() {
    var url = 'cancer_studies.json'
    axios.get(url)
      .then(response => this.studiesLoaded(response));
  }

  /**
   * Get Cancer Gene Census JSON.
   */
  initCancerGeneCensusRequest() {
    var url = 'cancer_census.json'
    axios.get(url)
      .then(response => this.cancerGenesLoaded(response));
  }

  /**
   * Get Cancer Types JSON.
   */
  initCancerTypesRequest() {
    var url = 'cancer_types.json'
    axios.get(url)
      .then(response => this.cancerTypesLoaded(response));
  }  

  /**
   * Cancer Gene Census Loaded.
   */
  cancerGenesLoaded(response) {
    console.log("cBioPortal State:  Genes loaded.");
    this.geneList = response.data;
    var localGeneDict = []
    for (var i = 0; i < response.data.length; i++) {
      var currentGene = response.data[i];
      localGeneDict[currentGene.GeneSymbol] = currentGene
    }
    this.geneDict = localGeneDict;
  }

  /**
   * Cancer Types Loaded.
   */
  cancerTypesLoaded(response) {
    console.log("cBioPortal State:  Cancer Types loaded.");
    var localCancerTypesDict = []
    for (var i = 0; i < response.data.length; i++) {
      var currentCancerType = response.data[i];
      localCancerTypesDict[currentCancerType.cancerTypeId] = currentCancerType;
    }
    this.cancerTypesDict = localCancerTypesDict;
    
    //  Now that we have the cancer types, get the cancer studies.
    setTimeout(this.initStudyRequest, 0);
 }

  /**
   * Cancer Studies Loaded.
   */
  studiesLoaded(response) {
    console.log("cBioPortal State:  Studies loaded.");
    var localStudyDict = [];
    for (var i = 0; i < response.data.length; i++) {
      var currentStudy = response.data[i];
      var currentCancerTypeId = currentStudy.cancerTypeId;
      var cancerTypeTokens = "";

      //  Walk up the OncoTree and Gather All Cancer Type Keywords
      while (currentCancerTypeId != null && currentCancerTypeId !== "tissue") {
        var cancerType = this.cancerTypesDict[currentCancerTypeId];
        cancerTypeTokens += cancerType.name.replace("/", " ") + " "
        currentCancerTypeId = cancerType.parent
        if (currentCancerTypeId === "null") {
          currentCancerTypeId = null;
        }
      }
      currentStudy.cancerTypeTokens = cancerTypeTokens;
      localStudyDict[currentStudy.studyId] = currentStudy;
    }

    this.studyList = response.data;
    this.studyDict = localStudyDict;
    this.initLunrIndex(this.studyList);
  }

  /**
   * Initialize the Lunr Javascript Search Engine.
   */
  initLunrIndex(studyList) {
    console.log("Initialize lunr.js index");
    this.idx = lunr(function () {
      //  Disable stop word filter.
      //  This is important, because we want to enable searhing for
      //  e.g. "ALL (Acute Lymphoid Leukemia), but "all" is
      //  considered a stopword.
      this.pipeline.remove(lunr.stopWordFilter);
      this.ref('studyId');
      this.field('name');
      this.field('shortName');
      this.field('description');
      this.field('pmid');
      this.field('citation');
      this.field('cancerTypeTokens');
      studyList.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
  }

  /**
   * Perform a Search against the Lunr Javascript Search Engine.
   */
  search() {
    console.log("Search text:  " + this.searchText);
    var localSearchResultsGenes = [];
    var nonGenes = [];

    this.checkGenes(localSearchResultsGenes, nonGenes);
    var nonGeneStr = nonGenes.join(" ");
    console.log("Checking non genes:  " + nonGeneStr);
    
    var searchResults = this.searchStudyIndex(nonGenes);
    var studiesIntersected = this.intersection(searchResults);
    var localSearchResultsStudies = this.extractStudyDetails(studiesIntersected);
    this.searchResultsGenes = localSearchResultsGenes;
    this.searchResultsStudies = localSearchResultsStudies;

    this.setSearchResultsSummaryMsg();
    this.currentStudySelected = null;
    this.studyGroupSelected = 0;
  }

  /**
   * Query for each token separately, so that we can perform an AND operation.
   */
  searchStudyIndex(nonGenes) {
    var searchResults = [];
    for (var i = 0; i < nonGenes.length; i++) {
      var currentToken = nonGenes[i].trim();
      var wildCardToken = this.getWildCardToken(currentToken);
      console.log("Searching for wild card term:  " + wildCardToken);
      var idxHits = this.idx.search(wildCardToken);

      //  If we get no hits, try a regular token
      if (idxHits.length === 0) {
        console.log("Nothing found, trying regular token:  " + currentToken);
        idxHits = this.idx.search(currentToken);
      }
      var studyIdList = [];
      for (var j = 0; j < idxHits.length; j++) {
        var hit = idxHits[j];
        console.log(hit.ref);
        studyIdList.push(hit.ref);
      }
      var studyList = studyIdList;
      searchResults.push(studyList);
    }
    return searchResults;
  }

  /**
   * Convert Token to Wild Card Token.
   */
  getWildCardToken(currentToken) {
    var wildCardToken;
    if (!currentToken.endsWith("*")) {
      wildCardToken = currentToken + "*";
    }
    return wildCardToken;
  }

  /**
   * Given a list of study IDs, extract Study Details.
   */
  extractStudyDetails(studiesIntersected) {
    var localSearchResultsStudies = [];
    for (var i = 0; i < studiesIntersected.length; i++) {
      var studyHit = this.studyDict[studiesIntersected[i]];
      localSearchResultsStudies.push({
        resultType: "study",
        id: studyHit.studyId,
        title: studyHit.name,
        description: studyHit.description
      });
    }
    return localSearchResultsStudies;
  }

  /**
   * Set the Global Search Results Summary Message.
   */
  setSearchResultsSummaryMsg() {
    if (this.searchResultsGenes.length === 0 && this.searchResultsStudies.length === 0) {
      this.searchResultsSummary = "";
    }
    else {
      if (this.searchResultsStudies.length === 1) {
        this.searchResultsSummary = this.searchResultsStudies.length + " matching study found.";
      }
      else if (this.searchResultsStudies.length > 1) {
        this.searchResultsSummary = this.searchResultsStudies.length + " matching studies found.";
      }
      else {
        this.searchResultsSummary = "";
      }
    }
  }

  /**
   * Perform an AND operation when multiple search terms are provided.
   */
  searchWithFilter(query) {
    var terms = query.split(' ');
    return this.idx.search(query).filter(function(result) {
        return Object.keys(result.matchData.metadata).length >= terms.length;
      });
  }

  /**
   * Check for Matching Genes.
   * Currently, only exact matches to HUGO Gene Symbols are considered true matches.
   */
  checkGenes(localSearchResults, nonGenes) {
    var tokenList = this.searchText.split(/[ ,]+/);
    this.currentGeneList = []
    for (var i = 0; i < tokenList.length; i++) {
      var token = tokenList[i].trim();
      var possibleGene = token.toUpperCase();
      if (this.geneDict[possibleGene]) {
        localSearchResults.push({
          resultType: "gene",
          id: possibleGene,
          title: possibleGene,
          description: this.geneDict[possibleGene].Name,
          roleInCancer:  this.geneDict[possibleGene].RoleinCancer
        });
        this.currentGeneList.push(possibleGene);
      }
      else {
        if (token.length > 0) {
          nonGenes.push(token);
        }
      }
    }
    this.currentGeneListStr = this.currentGeneList.join(" ")
  }

  /**
   * Intersection code copied straight from stackoverflow.
   */
  intersection() {
    var result = [];
    var lists;
  
    if(arguments.length === 1) {
      lists = arguments[0];
    } else {
      lists = arguments;
    }
  
    for(var i = 0; i < lists.length; i++) {
      var currentList = lists[i];
      for(var y = 0; y < currentList.length; y++) {
          var currentValue = currentList[y];
        if(result.indexOf(currentValue) === -1) {
          var existsInAll = true;
          for(var x = 0; x < lists.length; x++) {
            if(lists[x].indexOf(currentValue) === -1) {
              existsInAll = false;
              break;
            }
          }
          if(existsInAll) {
            result.push(currentValue);
          }
        }
      }
    }
    return result;
  }    
}