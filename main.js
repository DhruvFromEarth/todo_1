const fs = require('fs');
const { Command } = require('commander');
const program = new Command;

const file = 'todo.json';
if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([])); // Create an empty array if the file doesn't exist
    console.log(`File did'nt existed, created new file ${file}.`);
}

program
    .name('todo-list')
    .description('A todo list that allows adding, updating, removing and listing of a task.')
    .version('1.0.0');

program.command('add')
    .description('add eg. add "go to gym" p')
    .option('-c, --completed', 'completed task.')
    .argument('<task>', 'todo task.')
    .action((data, options) => {
        let fileDataJson = [];
        try {
            const fileData = fs.readFileSync(file, 'utf-8');
            fileDataJson = JSON.parse(fileData);
            const lastObjId = fileDataJson.length > 0 ? fileDataJson[fileDataJson.length - 1].id : 0; //if there is no list, return id zero.
            const addElem = {
                "id": lastObjId + 1,
                "todo": data,
                "status": (options.completed) ? "completed" : "pending"
            };
            fileDataJson.push(addElem);
        } catch (err) {
            if (err) console.error("File not found.\n", err)
        }
        fs.writeFile(file, JSON.stringify(fileDataJson,null,2), err => {
            if (err) {
                console.error("error in writing file", err);
            } else {
                console.log("task added.");
            }
        });
    });

program.command('rem')
    .description('remove eg. rem 2')
    .argument('<id>', 'ID to remove.')
    .action((id) => {
        let fileDataJson = [];
        const idNum = parseInt(id, 10);
        try {
            const fileData = fs.readFileSync(file, 'utf-8');
            fileDataJson = JSON.parse(fileData);
        } catch (err) {
            if (err) console.error("File not found.\n", err)
        }

        for (i = 0; i < fileDataJson.length; i++) {
            if (idNum === fileDataJson[i].id) {
                fileDataJson.splice(i, 1);
                break;
            }
        }

        fs.writeFile(file, JSON.stringify(fileDataJson,null,2), err => {
            if (err) {
                console.error("error in writing file", err);
            } else {
                console.log("task removed (if existed).");
            }
        });

    });

program.command('up')
    .description('update eg. up 2 -pt "go to gym"')
    .argument('<ID>', 'ID of task to update.')
    .option('-c, --completed', 'completed task.')
    .option('-p, --pending', 'pending task.')
    .option('-t, --task <task>', 'task to update.')
    .action((id, options) => {
        let fileDataJson = [];
        const idNum = parseInt(id, 10);
        try {
            const fileData = fs.readFileSync(file, 'utf-8');
            fileDataJson = JSON.parse(fileData);
        } catch (err) {
            if (err) console.error("File not found.\n", err)
        }

        for (i = 0; i < fileDataJson.length; i++) {
            if (idNum === fileDataJson[i].id) {
                if (options.task) {
                    fileDataJson[i].todo = options.task;
                }
                if (options.completed) {
                    fileDataJson[i].status = "completed";
                }
                if (options.pending) {
                    fileDataJson[i].status = "pending";
                }
                fs.writeFile(file, JSON.stringify(fileDataJson,null,2), err => {
                    if (err) {
                        console.error("error in writing file", err);
                    } else {
                        console.log("task updated.");
                    }
                });
                break;
            }
        }
    });

program.command('ls')
    .description('list todos eg. list -p')
    .option('-c, --completed', 'completed.')
    .option('-p, --pending', 'pending.')
    .action((options) => { 
        try {
            const fileData = fs.readFileSync(file, 'utf-8');
            const fileDataJson = JSON.parse(fileData);
            if(options.completed){
                for(i=0;i<fileDataJson.length;i++){
                    if(fileDataJson[i].status == "completed") console.log(fileDataJson[i]);
                }
            }
            else{
                for(i=0;i<fileDataJson.length;i++){
                    if(fileDataJson[i].status == "pending") console.log(fileDataJson[i]);
                }
            }
        } catch (err) {
            if (err) console.error("File not found.\n",err)
        }
    });

program.parse();