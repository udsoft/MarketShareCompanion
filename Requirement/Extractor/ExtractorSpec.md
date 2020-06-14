# Extractor
The Extractor is one a nestjs application which can be futher extended using the plugin

# Plugin
Plugin is a module of nest which contains responsible to get data from specific location. For example the Bursa saham is a plugin in the extractor. This Plugin should implements the plugin.interface.ts. 

### Requirement
The plugin has **preRun** , **run**, **postRun** method which is run when the normal task trigger is carried out. 

 - **preRun**(Task status *StartPreRun*) will prepare the database to check if the previous run task was successful and the status of the task is done. In any condition where the status is not correct failed with error , as for now only trigger of email will be sent and the **run** will be aborted. ***this is only applicable for version 0.1 as it is not the best approach***. Once the prerun is complete, the task will be updated to be *DonePreRun*.
 - **run**(Task Status *Running*) will check the carry on to extract the data from the source and store in the database. Once the run activity is done the status of the task will be update to be *DoneRunning*
 - **postRun**(Task Status *StartPostRun*) will close all the database connection and all the thread open for the following task, if any. The task will then update to status *Completed*.

