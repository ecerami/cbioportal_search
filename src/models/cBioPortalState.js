import { observable, computed, action } from "mobx";
import axios from 'axios';
import lunr from 'lunr';

/**
 * Encapsulate all State Variables for the Application.
 */
export default class cBioPortalState {
  @observable studyList = [];
  @observable geneList = [];
  @observable searchText = "";
  @observable searchResults = [];
  @observable currentGeneList = [];
  @observable currentGeneListStr = [];
  @observable currentStudySelected = null;
  @observable searchResultsSummary = "";
  studyDict = [];
  idx;  //Lunx search index

  constructor(props) {
    this.initStudyRequest = this.initStudyRequest.bind(this);
    this.initCancerGeneCensusRequest = this.initCancerGeneCensusRequest.bind(this);
    setTimeout(this.initStudyRequest, 0);
    setTimeout(this.initCancerGeneCensusRequest, 0);
  }

  /**
   * Get Cancer Studies JSON.
   */
  initStudyRequest() {
    var url = 'public/cancer_studies.json'
    axios.get(url)
      .then(response => this.studiesLoaded(response));
  }

  /**
   * Get Cancer Gene Census JSON.
   */
  initCancerGeneCensusRequest() {
    var url = 'public/cancer_census.json'
    axios.get(url)
      .then(response => this.cancerGenesLoaded(response));
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
   * Cancer Studies Loaded.
   */
  studiesLoaded(response) {
    console.log("cBioPortal State:  Studies loaded.");
    var localStudyDict = [];
    for (var i = 0; i < response.data.length; i++) {
      var currentStudy = response.data[i];
      localStudyDict[currentStudy.studyId] = currentStudy;
    }

    this.initLunrIndex(response);
    this.studyList = response.data;
    this.studyDict = localStudyDict;
  }

  /**
   * Initialize the Lunr Javascript Search Engine.
   */
  initLunrIndex(response) {
    this.idx = lunr(function () {
      this.ref('studyId');
      this.field('name');
      this.field('shortName');
      this.field('description');
      this.field('pmid');
      this.field('citation');
      this.field('cancerTypeId');
      response.data.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
  }

  /**
   * Perform a Search against the Lunr Javascript Search Engine.
   */
  search() {
    console.log("Search text:  " + this.searchText);
    var localSearchResults = []
    var nonGenes = [];

    this.checkGenes(localSearchResults, nonGenes);
    var nonGeneStr = nonGenes.join(" ");
    console.log("Checking non genes:  " + nonGeneStr);
    var idxHits = this.searchWithFilter(nonGeneStr.trim());
    console.log(this.idx.search(nonGeneStr));
    
    for (var i=0; i<idxHits.length; i++) {
      var hit = idxHits[i];
      var studyHit = this.studyDict[hit.ref];
      localSearchResults.push({
        resultType: "study",
        id: studyHit.studyId,
        title: studyHit.name,
        description: studyHit.description
      });
    }
    this.searchResults = localSearchResults;
    if (this.searchResults.length == 0) {
      this.searchResultsSummary = "No search results found.  Please try again!"; 
    } else {
      this.searchResultsSummary = "";
    }
    this.currentStudySelected = null;
  }

  /**
   * Perform an AND operation when multiple search terms are provided.
   */
  searchWithFilter(query) {
    var terms = query.split(' ');
    return this.idx.search(query).filter(function(result) {
        return Object.keys(result.matchData.metadata).length == terms.length;
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
        nonGenes.push(token);
      }
    }
    this.currentGeneListStr = this.currentGeneList.join(" ")
  }
}