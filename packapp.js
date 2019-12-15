// jos nimessä on . tai + riippuvuudet ja onclick ei toimi


const Package = (package) => {
    return (`<div class="packageElement">
        <h1 id="h_${package.key}">${package.name}</h1>
        <div class="info" id="i_${package.key}" style="display:none">
            <p class="desc" id="desc">${package.description}</p>
            <h2>dependencies</h2>
            <div id="dp_${package.key}" ></div>
            <h2>reverse dependencies</h2>
            <div id="do_${package.key}" ></div>
        </div>
    </div>`);
};

var openFile = function(event) {
    var packages = [];
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;

      //initial file split into array of raw strings of each package
      var rawArray = text
        .replace(/\n\r/g, "\n")
        .replace(/\r/g, "\n")
        .split(/\n{2,}/g);

      //constructing package objects from text
      var i = 0;
      rawArray.forEach(x => {
        if (x.length > 0) {
            packages.push({
                key: i,
                name: x.split(/\n/)[0].substring(9),
                description: x.split('Description: ').pop().split(/\n(?!\s)/g)[0],
                dependencies: x.includes('\nDepends: ') ? new Set(x.split('\nDepends: ').pop().split(/\n/)[0].split(', ').map(x => x.split(' ')[0])) : new Set(),
                dependsOn: new Set()
            });
        }
        i ++;
      });
      packages.sort((a, b) => a.name > b.name ? 1 : -1);
      
      //set reverse dependencies
      packages.forEach(p => {
        p.dependencies.forEach(d => {
            const dep = packages.find(z => z.name == d);
            if (dep) dep.dependsOn.add(p.name);
        });
      });

      // populate info fields about dependencies and populate page with packages ÄLÄ KOSKE ENÄÄ
      packages.forEach(p => {
        $('#output').append(Package(p));
        $(`#h_${p.key}`).click(function() {
            var elem = $(`#i_${p.key}`)
            elem.css('display') == 'block' ? elem.css('display', 'none') : elem.css('display', 'block')
        });
        p.dependsOn.forEach(d => {
            var pack = packages.find(p => p.name == d)
            if (pack) $(`#do_${p.key}`).append(`<p class="l_${pack.key}">${d}</p>`)
        })
        p.dependencies.forEach(d => {
            var pack = packages.find(p => p.name == d)
            if (pack) $(`#dp_${p.key}`).append(`<p class="l_${pack.key}">${d}</p>`)
        })  
      })
      packages.forEach(p => {
        $(`.l_${p.key}`).click(() => {
            $([document.documentElement, document.body]).animate({
                scrollTop: $(`#h_${p.key}`).offset().top
            }, 200);
            $(`#i_${p.key}`).css('display', 'block')
        })
      })
    };
    reader.readAsText(input.files[0]);
};